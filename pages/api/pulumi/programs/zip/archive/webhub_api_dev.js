// This function is the endpoint's request handler.
exports = async function(payload, response) {
  const variables = {};
  const response_statuses = [];
  try{
    const _SERVICENAME_ = "ServerlessInstance0";
    const { query, headers, body } = payload;
    
    
    const { MongoDB, MongoDBName } = JSON.parse(body.text()) || {};
    
    if (MongoDB && MongoDB.root && Array.isArray(MongoDB.chain)) {
      let db = null;
      let catch_err;
      if (MongoDBName) {
        try {
          db = await context.services.get(_SERVICENAME_).db(MongoDBName);
        } catch (err) {
          catch_err = err;
        }
      }
      
      
      if (db) {
        const res = await executeRequest({
          global_variables: variables,
          mongo: db,
          request: { request: MongoDB, loc: ['MongoDB'], chain: ['MongoDB'] },
        });
        
        response_statuses.push(...res.flat());
      } else {
        response_statuses.push({
          code: "internal_issue",
          message: "had trouble connecting to your database. Please try again.",
          error: { request: MongoDB, catch: catch_err },
        });
      }
      
      
      
    } else {
      
      response_statuses.push({
        code: "format_issue",
        message: "request must start with MongoDB and have property root: true, and chain: [...]",
        error: { request: MongoDB },
      });
    }
    
  } catch (err) {
    response_statuses.push({
      code: "internal_server_error",
      message: "Server error occurred, review error for more info",
      error: { catch: err },
    });
  }
  
  // lastly we need to go through each variable a choose the ones that need to be returned
  
  const ret_variables = {};
  for (const [key, vrble] of Object.entries(variables)) {
    if (vrble.return) {
      // shallow copy variables that need to be returned back to the user
      ret_variables[key] = { ...vrble };
    }
  }
  
  return { response: {
      status: response_statuses,
      variables: ret_variables,
    }
  };
};

const executeRequest = async ({ mongo, request, global_variables }) => {
  const { method, args, variable, chain, root } = (request ? request.request : undefined) || {};
  
  if (root && chain) {
    
    const request_statuses = [];
    
    for (let i = 0; i < chain.length; i++) {
      try {
        const executeRes = await executeRequest({
          mongo,
          request: { request: chain[i], loc: request.loc.concat([i]), chain: request.chain },
          global_variables
        });
        
        request_statuses.push(...executeRes);
      } catch (err) {
        
        request_statuses.push({
          code: "internal_server_error",
          message: "Server error occurred, review error for more info",
          executeRequest: {
            mongo,
            request: { request: chain[i], loc: request.loc.concat([i]), chain: request.chain },
          },
          error: { catch: err },
        });
      }
    }
    
    return request_statuses
  }
  
  if (!request || !method || (args && !Array.isArray(args))) {
    return [{
      code: "format_issue",
      message: "Undefined or improperly formatted request in chain.",
      error: { request }
    }];
  }
  
  const documentation_url = {
    base: "https://mongodb.github.io/node-mongodb-native",
    version: "6.3",
  }
  
  // documentation url structure: `${documentation_url.base}/${documentation_url.version}/${mongodb_classes[request_class]}.html#${methods[method]}`
  // check what type of method it is, a function or key for example: .connect() vs ['asyncIterator']()
  // technically all .methodName() can be formatted as ['methodName']()
  
  let m_not_generated;
  
  let m = null;
  let mHashTag = null;
  
  try {
    // type 1 method .methodName() regex
    const type_1_method_regex = /^(\.)(\w+)(\(\))/;
    const match_type_1 = method.match(type_1_method_regex)
    if (match_type_1) {
      const [, , methodName] = match_type_1;
      m = methodName;
      mHashTag = methodName;
    } else {
      // type 2 method .methodName() regex
      const type_2_method_regex = /^(\[[\"\'])(.*)([\"\']\])(\(\))/;
      const match_type_2 = method.match(type_2_method_regex)
      if (match_type_2) {
        const [, , methodName] = match_type_2;
        m = methodName;
        mHashTag = `_${methodName}_`;
      }
    }
    
  } catch (err) {
    m_not_generated = [{
      code: "internal_server_error",
      message: "Server error occurred, review error for more info (m not generated)",
      request,
      error: { catch: err },
    }]
  }
  
  if (m_not_generated) {
    return m_not_generated
  }

  
  if (!m) {
    return [{
      code: "format_issue",
      message: `Method name not formatted correctly: ${method}. Must be of the form: .connect() or ['connect']() as an example.`,
      error: { request },
      mongo_variable: mongo,
    }];
  }
  
  let method_not_found_err;
  
  try {
    // Next check if the method is valid to do on the mongo variable
    if (!mongo[m]) {
      method_not_found_err = [{
        code: "method_not_found",
        message: `The mongodb variable doesn't not have a method with the name ${m}.`,
        error: { request },
        mongo_variable: mongo,
      }];
    }
  } catch (err) {
    method_not_found_err = [{
      code: "internal_server_error",
      message: "Server error occurred, review error for more info (!mongo[m] invalid)",
      mongo_variable: mongo,
      m,
      request,
      error: { catch: err },
    }]
  }
  
  
  if (method_not_found_err) {
    return method_not_found_err
  }
  
  
  
  // next regardless we will try running the function with the given args
  let res = null;
  // make a copy
  let request_chain = request.chain.slice();
  
  let execution_error;
  
  try {
    // always await even if the function doesn't return a promise
    res = await mongo[m](...(args || []));
    request_chain.push(`.${m}(${(args || []).toString()})`);
  } catch (err) {
    execution_error = [{
      code: "execution_error",
      message: "Couldn't execute last command in chain. Check error and review MongoDB documentation.",
      error: {
        request,
        mongo,
        method,
        m,
        args,
        catch: err,
        // still need to have a reliable way of parsing mongo variable class name
        // documentation_url: `${documentation_url.base}/${documentation_url.version}/${}.html#${mHashTag}`
      },
      mongo_variable: mongo,
    }];
  }
  
  if (execution_error) {
    return execution_error;
  }
  
  // check if we should save the variable name
  if (variable && variable.name) {
    global_variables[variable.name] = { value: res, 'return': variable ? variable.return : undefined };
  }
  
  if (Array.isArray(chain) && chain.length > 0) {
    let request_statuses = []
  
    // lastly check if there is a chain of request that needs to be executed
    for (let i = 0; i < chain.length; i++) {
      try {
        
        const executeRes = await executeRequest({
          mongo: res,
          request: { request: chain[i], loc: request.loc.concat([i]), chain: request_chain },
          global_variables
        });
      
        request_statuses.push(...executeRes);
      
      } catch (err) {
        
        request_statuses.push({
          code: "internal_server_error",
          message: "Server error occurred, review error for more info",
          executeRequest: {
            mongo: res,
            request: { request: chain[i], loc: request.loc.concat([i]), chain: request_chain },
          },
          error: { catch: err },
        });
      }
      
      return request_statuses
    }
  }
  
  return [{
    code: "chain_complete",
    message: "This chain ran successfully!",
    success: { request: {...request, chain: request_chain }, value: res },
  }];
  
};
