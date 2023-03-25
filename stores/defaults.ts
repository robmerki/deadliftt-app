import { Node, Edge } from 'reactflow'
import { FlowData } from './nodeStore'
import { v4 as uuidv4 } from 'uuid'

export const defaultNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start Here' },
    position: { x: 0, y: 0 },
  },
] as Node[]

export const defaultEdges = [] as Edge[]

export const defaultFlow = {
  id: uuidv4(),
  title: 'Untitled',
  nodes: defaultNodes,
  edges: defaultEdges,
} as FlowData
