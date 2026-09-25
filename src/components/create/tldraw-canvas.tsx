'use client'

import { getSnapshot, loadSnapshot, Tldraw, type Editor } from 'tldraw'
import { useEffect, useRef } from 'react'

export default function TldrawCanvas({snapshot,onChange,onEditor}:{snapshot:unknown;onChange:(snapshot:unknown)=>void;onEditor:(editor:Editor)=>void}){
 const unlisten=useRef<(()=>void)|null>(null)
 useEffect(()=>()=>unlisten.current?.(),[])
 return <Tldraw licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY} onMount={editor=>{onEditor(editor);if(snapshot){try{loadSnapshot(editor.store,snapshot as Parameters<typeof loadSnapshot>[1])}catch{ /* Invalid records are ignored; the original remains exportable. */ }}unlisten.current=editor.store.listen(()=>onChange(getSnapshot(editor.store)),{scope:'document',source:'user'})}}/>
}
