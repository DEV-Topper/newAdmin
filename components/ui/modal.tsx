"use client"
import { useEffect, ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  variant?: 'success' | 'error' | 'default'
}

export function Modal({ isOpen, onClose, title, children, variant = 'default' }: ModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!isOpen) return null

  const bgColor = variant === 'success' ? 'bg-green-50' 
    : variant === 'error' ? 'bg-red-50'
    : 'bg-white'

  const titleColor = variant === 'success' ? 'text-green-800'
    : variant === 'error' ? 'text-red-800'
    : 'text-gray-900'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  p-4 bg-black/50">
      <div className={`relative w-full max-w-3xl rounded-lg shadow-lg ${bgColor}`}>
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h3 className={`text-lg font-semibold mb-2 ${titleColor}`}>
            {title}
          </h3>
          
          <div className="mt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}