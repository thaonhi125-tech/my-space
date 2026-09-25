import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { WorkspaceDB, parseBackup } from './db'
import { newBoard, newDocument } from './models'

describe('local workspace persistence',()=>{
 let database:WorkspaceDB
 beforeEach(()=>{database=new WorkspaceDB(`test-${crypto.randomUUID()}`)})
 afterEach(async()=>database.delete())
 it('creates, renames, duplicates and deletes documents',async()=>{const original=newDocument('Draft');await database.documents.add(original);await database.documents.update(original.id,{title:'Renamed'});const duplicate={...original,id:crypto.randomUUID(),title:'Renamed copy'};await database.documents.add(duplicate);expect((await database.documents.get(original.id))?.title).toBe('Renamed');expect(await database.documents.count()).toBe(2);await database.documents.delete(original.id);expect(await database.documents.toArray()).toEqual([duplicate])})
 it('saves and restores editor content',async()=>{const document=newDocument();document.content={type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'Still here'}]}]};await database.documents.put(document);expect((await database.documents.get(document.id))?.content).toEqual(document.content)})
 it('creates and restores a board snapshot',async()=>{const board=newBoard('Map');board.snapshot={store:{'shape:1':{typeName:'shape'}}};await database.boards.put(board);expect((await database.boards.get(board.id))?.snapshot).toEqual(board.snapshot)})
})
describe('backup validation',()=>{it('accepts a versioned backup',()=>{const backup={format:'my-space-backup' as const,version:1 as const,exportedAt:new Date().toISOString(),documents:[],boards:[]};expect(parseBackup(backup)).toEqual(backup)});it('rejects invalid imports',()=>expect(()=>parseBackup({documents:[]})).toThrow(/not a My Space backup/))})
