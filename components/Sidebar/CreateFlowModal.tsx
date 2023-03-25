import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { classNames } from '@/util/classNames'
import axios from 'axios'
import nodeStore from '@/stores/nodeStore'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const CreateFlowModal = ({ open, setOpen }: Props) => {
  const [category, setCategory] = useState('')
  const [keywords, setKeywords] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const createNewFlow = nodeStore((state) => state.createNewFlow)

  const handleCreateFlow = async () => {
    setLoading(true)
    axios
      .post('/api/openai', {
        category,
        keywords,
      })
      .then((res) => {
        setResults(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (isLoading) return
    if (!results) return
    if (!isLoading && results) {
      createNewFlow(category, results)
      setOpen(false)
    }
    return () => {
      setCategory('')
      setKeywords('')
      setResults(null)
    }
  }, [results, isLoading, category, createNewFlow, setOpen])

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-1 text-center sm:mt-1">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Create A New Mindmap
                      </Dialog.Title>
                      <div className="mt-1 mb-3">
                        <p className="text-sm text-gray-500">
                          Input a category and some keywords to get started.
                        </p>
                      </div>
                      <div className="text-left my-4 flex flex-col gap-4">
                        <div>
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Main Category
                          </label>
                          <div className="mt-2">
                            <input
                              type="category"
                              name="category"
                              id="category"
                              className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="trains"
                              onChange={(e) => setCategory(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="keywords"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Additional Keywords
                          </label>
                          <div className="mt-2">
                            <input
                              type="keywords"
                              name="keywords"
                              id="keywords"
                              className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="locomotives, electric trains, railroad economics"
                              onChange={(e) => setKeywords(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className={classNames(
                        isLoading ? 'opacity-50 cursor-wait' : '',
                        'inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      )}
                      onClick={handleCreateFlow}
                    >
                      Create
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default CreateFlowModal
