"use client"

// This is a development entry point for the app.
// It is not used in production or included in the build.
import React, { useState } from 'react';

  import { Button } from "@/isoflow/components/ui/button"
import { Separator } from '@/isoflow/components/ui/separator';
import { Badge } from '@/isoflow/components/ui/badge';
import { Card, CardContent } from '@/isoflow/components/ui/card';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'


export default function Item({ id, index, type, name }) {

    const handleDragEnd = (result) => {
        const { destination } = result || {};
        if (!destination) return

        // this means it was dropped to the correct location
    };

    return (
        <Draggable key={id} draggableId={id} index={index} type="TASK">
            {(provided) => <div id={id} className="flex flex-col items-center px-3" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <Card className="w-[350px]  mb-[15px]">
                    <CardContent className="flex flex-col py-2">
                        <div className="flex justify-between">
                            <div className="flex pt-2 items-center">
                                <Badge className="rounded-lg">{type}</Badge>
                                <span className="text-labelMuted mx-1 text-sm text-slate-500">Workflow</span>
                            </div>
                        </div>
                        <div className="whitespace-nowrap text-ellipsis overflow-hidden w-full pb-2 pt-1 font-bold text-sm">{name}</div>
                    </CardContent>
                </Card>
            </div>}
        </Draggable>
    )

};
