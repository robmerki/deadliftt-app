import React from 'react'
import nodeStore, { NodeStore, FlowData } from '@/stores/nodeStore'
import { shallow } from 'zustand/shallow'
import findIndex from 'lodash/findIndex'
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
  createNewFlow: state.createNewFlow,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  resetCurrentFlow: state.resetCurrentFlow,
})

const Canvas = () => {
  const {
    currentFlowId,
    flows,
    createNewFlow,
    onNodesChange,
    onEdgesChange,
    onConnect,
    resetCurrentFlow,
  } = nodeStore(selector, shallow)

  const currentFlowIndex = findIndex(
    flows,
    (flow: FlowData) => flow.id === currentFlowId
  )

  const { nodes, edges, title } = flows[currentFlowIndex]

  function handleCreateNewFlow() {
    const newTitle = 'new title!'
    createNewFlow(newTitle)
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Panel position="top-left">
        <div onClick={handleCreateNewFlow}>New Graph</div>
      </Panel>
      <Panel position="top-center">{title}</Panel>
      <Panel position="top-right" onClick={resetCurrentFlow}>
        Reset Graph
      </Panel>
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  )
}

export default Canvas
