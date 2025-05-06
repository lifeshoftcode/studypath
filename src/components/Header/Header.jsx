import React from 'react'

export default function Header({ curriculum }) {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl text-gray-800 font-bold">Seguimiento de Pensum</h1>
      <h2 className="text-2xl text-gray-600">{curriculum.career} - {curriculum.title}</h2>
      <p className="text-gray-500">Versión: {curriculum.version} | Facultad: {curriculum.faculty}</p>
    </header>
  )
}
