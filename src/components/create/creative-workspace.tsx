'use client'

import { Copy, Download, FilePlus2, Menu, Pencil, Save, Trash2, Upload, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Editor } from 'tldraw'
import { db, isQuotaError } from '@/lib/db'
import { newBoard, type LocalBoard, type SaveState } from '@/lib/models'
import { useTheme } from '../theme-context'
import './create.css'

const Canvas = dynamic(() => import('./tldraw-canvas'), {
  ssr: false,
  loading: () => (
    <div className="center-state">
      <div className="spinner" />
      <p>Loading the infinite canvas…</p>
    </div>
  ),
})

const download = (name: string, value: unknown) => {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }))
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function CreativeWorkspace() {
  const [boards, setBoards] = useState<LocalBoard[]>([])
  const [activeId, setActiveId] = useState('')
  const [loading, setLoading] = useState(true)
  const [panel, setPanel] = useState(true)
  const [save, setSave] = useState<SaveState>('idle')
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null)

  // Modals state
  const [boardToDelete, setBoardToDelete] = useState<LocalBoard | null>(null)
  const [boardToRename, setBoardToRename] = useState<LocalBoard | null>(null)
  const [renameInput, setRenameInput] = useState('')

  const { theme } = useTheme()
  const editorRef = useRef<Editor | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const active = boards.find(b => b.id === activeId)

  const refresh = useCallback(async (id?: string) => {
    const all = await db.boards.orderBy('updatedAt').reverse().toArray()
    setBoards(all)
    const wanted = id || localStorage.getItem('my-space:last-board') || all[0]?.id
    if (wanted) {
      setActiveId(all.some(b => b.id === wanted) ? wanted : all[0]?.id)
    }
  }, [])

  useEffect(() => {
    void (async () => {
      try {
        let all = await db.boards.toArray()
        if (!all.length) {
          const first = newBoard('Ideas board')
          await db.boards.add(first)
          all = [first]
        }
        await refresh()
      } catch {
        setNotice({ text: 'Canvas storage is unavailable. You can draw, but export before leaving.', error: true })
      } finally {
        setLoading(false)
      }
    })()
  }, [refresh])

  useEffect(() => {
    if (activeId) {
      localStorage.setItem('my-space:last-board', activeId)
    }
  }, [activeId])

  const create = async () => {
    const b = newBoard()
    await db.boards.add(b)
    await refresh(b.id)
    setNotice({ text: `Created "${b.title}"` })
  }

  const openRenameModal = (b: LocalBoard) => {
    setBoardToRename(b)
    setRenameInput(b.title)
  }

  const confirmRename = async () => {
    if (!boardToRename) return
    const title = renameInput.trim() || 'Untitled board'
    await db.boards.update(boardToRename.id, { title, updatedAt: new Date().toISOString() })
    setBoards(v => v.map(b => (b.id === boardToRename.id ? { ...b, title } : b)))
    setBoardToRename(null)
  }

  const updateHeaderTitle = (title: string) => {
    if (!active) return
    setBoards(v => v.map(b => (b.id === active.id ? { ...b, title } : b)))
    setSave('saving')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        await db.boards.update(active.id, {
          title: title || 'Untitled board',
          updatedAt: new Date().toISOString(),
        })
        setSave('saved')
      } catch {
        setSave('error')
      }
    }, 500)
  }

  const duplicate = async (b: LocalBoard) => {
    const copy = {
      ...b,
      id: crypto.randomUUID(),
      title: `${b.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await db.boards.add(copy)
    await refresh(copy.id)
    setNotice({ text: `Duplicated "${copy.title}"` })
  }

  const confirmDelete = async () => {
    if (!boardToDelete) return
    const target = boardToDelete
    setBoardToDelete(null)
    await db.boards.delete(target.id)
    const rest = boards.filter(x => x.id !== target.id)
    if (!rest.length) {
      const fresh = newBoard()
      await db.boards.add(fresh)
      await refresh(fresh.id)
    } else {
      await refresh(rest[0].id)
    }
    setNotice({ text: `Deleted "${target.title}"` })
  }

  const changed = (snapshot: unknown) => {
    if (!activeId) return
    setSave('saving')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        const updatedAt = new Date().toISOString()
        await db.boards.update(activeId, { snapshot, updatedAt })
        setBoards(v => v.map(b => (b.id === activeId ? { ...b, snapshot, updatedAt } : b)))
        setSave('saved')
      } catch (err) {
        setSave('error')
        setNotice({
          text: isQuotaError(err)
            ? 'Browser storage is full. Export this board now; the canvas remains open.'
            : 'The board could not be saved. Export it before leaving.',
          error: true,
        })
      }
    }, 900)
  }

  const importBoard = async (file?: File) => {
    if (!file) return
    try {
      const data = JSON.parse(await file.text()) as { format?: string; snapshot?: unknown; title?: string }
      const snapshot = data.format === 'my-space-board' ? data.snapshot : data
      if (!snapshot || typeof snapshot !== 'object') throw new Error()
      const b = newBoard(data.title || file.name.replace(/\.[^.]+$/, ''))
      b.snapshot = snapshot
      await db.boards.add(b)
      await refresh(b.id)
      setNotice({ text: `Board "${b.title}" imported.` })
    } catch {
      setNotice({ text: 'This is not a valid board snapshot.', error: true })
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div className="center-state">
        <div className="spinner" />
        <p>Restoring boards…</p>
      </div>
    )
  }

  return (
    <div className="creative">
      {/* Board Panel Sidebar */}
      <aside className={`board-panel ${panel ? '' : 'closed'}`} aria-label="Boards navigation">
        <div className="board-heading">
          <div>
            <span className="eyebrow">Creative mode</span>
            <h1>Boards</h1>
          </div>
          <button className="icon-button" onClick={create} aria-label="New board" title="Create new board">
            <FilePlus2 size={20} />
          </button>
        </div>

        <div className="board-list">
          {boards.map(b => {
            const isActive = b.id === activeId
            return (
              <div key={b.id} className={`board-row ${isActive ? 'active' : ''}`}>
                <button
                  type="button"
                  className="board-select-btn"
                  onClick={() => setActiveId(b.id)}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="board-preview">
                    {b.snapshot ? <Pencil size={18} /> : <span>+</span>}
                  </span>
                  <span className="board-copy">
                    <strong>{b.title}</strong>
                    <small>{new Date(b.updatedAt).toLocaleDateString()}</small>
                  </span>
                </button>

                <div className="board-actions">
                  <button
                    type="button"
                    className="board-action-btn"
                    title="Rename board"
                    aria-label={`Rename ${b.title}`}
                    onClick={e => {
                      e.stopPropagation()
                      openRenameModal(b)
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="board-action-btn"
                    title="Duplicate board"
                    aria-label={`Duplicate ${b.title}`}
                    onClick={e => {
                      e.stopPropagation()
                      void duplicate(b)
                    }}
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    type="button"
                    className="board-action-btn delete-btn"
                    title="Delete board"
                    aria-label={`Delete ${b.title}`}
                    onClick={e => {
                      e.stopPropagation()
                      setBoardToDelete(b)
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="board-footer">
          <button className="button" onClick={() => fileRef.current?.click()}>
            <Upload size={15} /> Import board
          </button>
          <button
            className="button"
            onClick={() =>
              active &&
              download(`${active.title}.tldr.json`, {
                format: 'my-space-board',
                version: 1,
                title: active.title,
                snapshot: active.snapshot,
              })
            }
          >
            <Download size={15} /> Export JSON
          </button>
          <input
            ref={fileRef}
            className="sr-only"
            type="file"
            accept=".json,.tldr"
            onChange={e => void importBoard(e.target.files?.[0])}
          />
          <p>Drawings stay on this device. Use tldraw&apos;s menu to export PNG or SVG.</p>
        </div>
      </aside>

      {/* Canvas Area */}
      <section className="canvas-area">
        <header className="canvas-header">
          <button
            className="icon-button"
            onClick={() => setPanel(v => !v)}
            aria-label={panel ? 'Hide boards sidebar' : 'Show boards sidebar'}
            title={panel ? 'Hide sidebar' : 'Show sidebar'}
          >
            <Menu size={18} />
          </button>

          <div className="header-title-wrap">
            {active && (
              <input
                className="header-title-input"
                value={active.title}
                onChange={e => updateHeaderTitle(e.target.value)}
                aria-label="Board title"
                title="Click to rename board"
                placeholder="Untitled board"
              />
            )}
          </div>

          <div className="save-state" data-state={save}>
            <span className="dot" />
            {save === 'saving' ? 'Saving…' : save === 'error' ? 'Save failed' : 'Saved locally'}
          </div>

          <div className="canvas-header-actions">
            {active && (
              <button
                className="icon-button"
                onClick={() =>
                  download(`${active.title}.tldr.json`, {
                    format: 'my-space-board',
                    version: 1,
                    title: active.title,
                    snapshot: active.snapshot,
                  })
                }
                title="Export board snapshot (JSON)"
                aria-label="Export board"
              >
                <Download size={17} />
              </button>
            )}
          </div>
        </header>

        <div className="canvas-wrap">
          {active && (
            <Canvas
              key={active.id}
              snapshot={active.snapshot}
              theme={theme}
              onEditor={e => (editorRef.current = e)}
              onChange={changed}
            />
          )}
        </div>
      </section>

      {/* Rename Board Modal */}
      {boardToRename && (
        <div className="modal-overlay" onClick={() => setBoardToRename(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rename Board</h3>
              <button className="icon-button" onClick={() => setBoardToRename(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <input
              className="input"
              value={renameInput}
              onChange={e => setRenameInput(e.target.value)}
              placeholder="Board name"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') void confirmRename()
              }}
            />
            <div className="modal-footer">
              <button type="button" className="button" onClick={() => setBoardToRename(null)}>
                Cancel
              </button>
              <button type="button" className="button primary" onClick={() => void confirmRename()}>
                Save Name
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Board Confirmation Modal */}
      {boardToDelete && (
        <div className="modal-overlay" onClick={() => setBoardToDelete(null)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Board</h3>
              <button className="icon-button" onClick={() => setBoardToDelete(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <p className="muted" style={{ margin: 0, lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>“{boardToDelete.title}”</strong>? This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button type="button" className="button" onClick={() => setBoardToDelete(null)}>
                Cancel
              </button>
              <button type="button" className="button danger" onClick={() => void confirmDelete()}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {notice && (
        <div className={`toast ${notice.error ? 'error' : ''}`} role="status">
          <span>{notice.text}</span>
          <button className="icon-button" onClick={() => setNotice(null)} aria-label="Dismiss notification">
            <X size={16} />
          </button>
          {notice.error && active && (
            <button className="button" onClick={() => download(`${active.title}.json`, active.snapshot)}>
              <Save size={14} /> Export now
            </button>
          )}
        </div>
      )}
    </div>
  )
}
