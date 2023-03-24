import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import produce from 'immer'
import findIndex from 'lodash/findIndex'
import { v4 as uuidv4 } from 'uuid'

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
  _hasHydrated: boolean
  flows: FlowData[]
  currentFlowId: string
  getCurrentFlow: () => FlowData
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  resetCurrentFlow: () => void
  createNewFlow: (title: string) => void
  changeActiveFlow: (id: string) => void
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
      _hasHydrated: false, // check for local storage hydration
      flows: [defaultFlow],
      changeActiveFlow: (flowId: string) => {
        set(
          produce((state) => {
            state.currentFlowId = flowId
          })
        )
      },
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
              state.flows[currentFlowIndex].edges
            )
          })
        )
      },
      onConnect: (connection: Connection) => {
        const currentFlowIndex = getCurrentFlowIndex(get)
        set(
          produce((state) => {
            state.flows[currentFlowIndex].edges = addEdge(
              connection,
              state.flows[currentFlowIndex].edges
            )
          })
        )
      },
      resetCurrentFlow: () => {
        set(
          produce((state) => {
            const currentFlowIndex = getCurrentFlowIndex(get)
            const currentFlowId = state.currentFlowId
            state.flows[currentFlowIndex] = {
              ...defaultFlow,
              id: currentFlowId,
            }
          })
        )
      },
      createNewFlow: (title: string) => {
        set(
          produce((state) => {
            const newFlow = {
              ...defaultFlow,
              id: uuidv4(),
              title: title,
            }
            state.flows.push(newFlow)
            state.currentFlowId = newFlow.id
          })
        )
      },
    }),
    {
      name: 'nodestore',
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: () => {
        return () => {
          nodeStore.setState({ _hasHydrated: true })
        }
      },
    }
  )
)

export default nodeStore
