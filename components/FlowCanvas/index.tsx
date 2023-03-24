import React, { useState } from 'react'
import nodeStore, { NodeStore, FlowData } from '@/stores/nodeStore'
import { shallow } from 'zustand/shallow'
import findIndex from 'lodash/findIndex'
import TextUpdaterNode from './CustomNodes/TextUpdaterNode'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'

const selector = (state: NodeStore) => ({
  currentFlowId: state.currentFlowId,
  flows: state.flows,
  updateFlowTitle: state.updateFlowTitle,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  resetCurrentFlow: state.resetCurrentFlow,
})

const nodeTypes = { textUpdater: TextUpdaterNode }

const Canvas = () => {
  const {
    currentFlowId,
    flows,
    updateFlowTitle,
    onNodesChange,
    onEdgesChange,
    onConnect,
    // resetCurrentFlow,
  } = nodeStore(selector, shallow)
  const currentFlowIndex = findIndex(
    flows,
    (flow: FlowData) => flow.id === currentFlowId
  )
  const { nodes, edges, title } = flows[currentFlowIndex]

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitleText, setNewTitleText] = useState(title)

  function handleDoneWithEditingTitle() {
    setIsEditingTitle(false)
    updateFlowTitle(newTitleText)
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
    >
      <Panel position="top-center">
        <div>
          {!isEditingTitle && (
            <h2
              className="font-lg font-bold text-blue-900 text-center"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}
            </h2>
          )}
          {isEditingTitle && (
            <input
              className="font-lg font-bold text-blue-900 text-center"
              value={newTitleText}
              onChange={(evt) => setNewTitleText(evt.target.value)}
              onBlur={handleDoneWithEditingTitle}
              onKeyDown={(evt) => {
                if (evt.key === 'Enter') handleDoneWithEditingTitle()
              }}
            />
          )}
        </div>
      </Panel>
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  )
}

export default Canvas
