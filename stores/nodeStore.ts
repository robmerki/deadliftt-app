import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import produce from 'immer'
import findIndex from 'lodash/findIndex'
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow'

import { defaultFlow } from './defaults'

export type FlowData = {
  id: string
  title: string
  nodes: Node[]
  edges: Edge[]
}

export type NodeStore = {
  flows: FlowData[]
  currentFlowId: string
  getCurrentFlow: () => FlowData
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  resetCurrentFlow: () => void
}

function getCurrentFlowIndex(get: () => NodeStore) {
  return findIndex(
    get().flows,
    (flow: FlowData) => flow.id === get().currentFlowId
  )
}

const nodeStore = create(
  persist<NodeStore>(
    (set, get) => ({
      flows: [defaultFlow],
      currentFlowId: defaultFlow.id,
      getCurrentFlow: (): FlowData => {
        const currentFlowIndex = getCurrentFlowIndex(get)
        return get().flows[currentFlowIndex]
      },
      onNodesChange: (changes: NodeChange[]) => {
        const currentFlowIndex = getCurrentFlowIndex(get)
        set(
          produce((state) => {
            state.flows[currentFlowIndex].nodes = applyNodeChanges(
              changes,
              state.flows[currentFlowIndex].nodes
            )
          })
        )
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        const currentFlowIndex = getCurrentFlowIndex(get)
        set(
          produce((state) => {
            state.flows[currentFlowIndex].edges = applyEdgeChanges(
              changes,
              get().flows[currentFlowIndex].edges
            )
          })
        )
      },
      onConnect: (connection: Connection) => {
        const currentFlowIndex = getCurrentFlowIndex(get)
        produce((state) => {
          state.flows[currentFlowIndex].edges = addEdge(
            connection,
            get().flows[currentFlowIndex].edges
          )
        })
      },
      resetCurrentFlow: () => {
        const id = get().currentFlowId
        produce((state) => {
          state.flows[id] = defaultFlow
        })
      },
    }),
    {
      name: 'nodestore',
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export default nodeStore
