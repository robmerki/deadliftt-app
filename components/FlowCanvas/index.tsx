import React from 'react'
import nodeStore, { NodeStore } from '@/stores/nodeStore'
import { shallow } from 'zustand/shallow'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'

const selector = (state: NodeStore) => ({
  // currentFlowId: state.currentFlowId,
  getCurrentFlow: state.getCurrentFlow,
  // flows: state.flows,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  resetCurrentFlow: state.resetCurrentFlow,
})

const Canvas = () => {
  const {
    // currentFlowId,
    getCurrentFlow,
    // flows,
    onNodesChange,
    onEdgesChange,
    onConnect,
    resetCurrentFlow,
  } = nodeStore(selector, shallow)

  const { nodes, edges } = getCurrentFlow()

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Panel position="top-left" onClick={resetCurrentFlow}>
        Reset
      </Panel>
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  )
}

export default Canvas
