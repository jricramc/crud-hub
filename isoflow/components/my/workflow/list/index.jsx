"use client"

// This is a development entry point for the app.
// It is not used in production or included in the build.
import React, { useState } from 'react';


import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import Item from "@/isoflow/components/my/workflow/item"
import { Separator } from '@/isoflow/components/ui/separator';


export default function List({ id, list, indexes = [] }) {

    const cnt = list.map((container, i) => <Droppable key={`${i}`} droppableId={`${id}-${i}`}>
        {(provided) => <div
            id={`${i}`} className={`${i}`} {...provided.droppableProps} ref={provided.innerRef}
            style={{
                position: 'relative',
            }}
        >
            {container.map((item, index) => <>
                <Item key={item.id} id={item.id} index={index} type={item.type} name={item.name} />
                {item?.list?.length > 0 && <div className="flex flex-row pt-5">
                    <List id={`${i}-${index}`} list={item.list} />
                </div>}
            </>)}
            {provided.placeholder}
            {provided.placeholder}
        </div>}
    </Droppable>)

    return cnt

};
