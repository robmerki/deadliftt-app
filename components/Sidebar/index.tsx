import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import nodeStore, { NodeStore, FlowData } from '@/stores/nodeStore'
import { shallow } from 'zustand/shallow'
import { PlusCircleIcon } from '@heroicons/react/20/solid'

import { classNames } from '@/util/classNames'
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import CreateFlowModal from './CreateFlowModal'

const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
  { name: 'Settings', href: '#', icon: UsersIcon, current: false },
]

const selector = (state: NodeStore) => ({
  currentFlowId: state.currentFlowId,
  flows: state.flows,
  changeActiveFlow: state.changeActiveFlow,
})

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const { currentFlowId, flows, changeActiveFlow } = nodeStore(
    selector,
    shallow
  )

  const handleChangeActiveFlow = (newId: string) => {
    changeActiveFlow(newId)
  }

  const toggleCreateModal = () => {
    setCreateModalOpen(!createModalOpen)
  }

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="h-screen">
                  <SidebarContent
                    flows={flows}
                    currentFlowId={currentFlowId}
                    handleChangeActiveFlow={handleChangeActiveFlow}
                    toggleCreateModal={toggleCreateModal}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="h-screen hidden lg:static lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <SidebarContent
          flows={flows}
          currentFlowId={currentFlowId}
          handleChangeActiveFlow={handleChangeActiveFlow}
          toggleCreateModal={toggleCreateModal}
        />
      </div>

      {/* Mobile */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white py-4 px-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <CreateFlowModal open={createModalOpen} setOpen={setCreateModalOpen} />
    </>
  )
}

const SidebarContent = ({
  flows,
  currentFlowId,
  handleChangeActiveFlow,
  toggleCreateModal,
}: {
  flows: FlowData[]
  currentFlowId: string
  handleChangeActiveFlow: (newId: string) => void
  toggleCreateModal: () => void
}) => {
  return (
    <div className="h-screen overflow-hidden border-r border-gray-200 bg-white px-6 flex flex-col">
      <div className="flex h-16 shrink-0 items-center">Deadliftt</div>
      <nav className="min-h-0 flex flex-col">
        <div className="mb-7">
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-50 text-blue-600'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? 'text-blue-600'
                        : 'text-gray-400 group-hover:text-blue-600',
                      'h-6 w-6 shrink-0'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="text-xs font-semibold leading-6 text-gray-400">
            Your flows
          </div>
          <ul
            role="list"
            className="-mx-2 mt-2 flex flex-col space-y-1 overflow-y-scroll min-h-0"
          >
            {flows.map((flow) => (
              <li
                key={flow.id}
                onClick={() => handleChangeActiveFlow(flow.id)}
                className="cursor-pointer"
              >
                <a
                  className={classNames(
                    flow.id === currentFlowId
                      ? 'bg-gray-50 text-blue-600'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                  )}
                >
                  <span
                    className={classNames(
                      flow.id === currentFlowId
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-400 border-gray-200 group-hover:border-blue-600 group-hover:text-blue-600',
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                    )}
                  >
                    {flow.title.slice(0, 2)}
                  </span>
                  <span className="truncate">{flow.title}</span>
                </a>
              </li>
            ))}
          </ul>
          <CreateNewButton onClick={toggleCreateModal} />
        </div>
      </nav>
    </div>
  )
}

const CreateNewButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <>
      <div className="h-px bg-gray-200 my-4" />
      <div className="-mx-2 mb-4">
        <button
          onClick={onClick}
          type="button"
          className="w-full inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Create New
        </button>
      </div>
    </>
  )
}
