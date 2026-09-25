import Dexie, { type EntityTable } from 'dexie'
import type { Backup, LocalBoard, LocalDocument } from './models'

export class WorkspaceDB extends Dexie {
  documents!:EntityTable<LocalDocument,'id'>
  boards!:EntityTable<LocalBoard,'id'>
  constructor(name='my-space') { super(name); this.version(1).stores({ documents:'id,updatedAt,title',boards:'id,updatedAt,title' }) }
}
export const db = new WorkspaceDB()
export async function exportBackup():Promise<Backup>{ return {format:'my-space-backup',version:1,exportedAt:new Date().toISOString(),documents:await db.documents.toArray(),boards:await db.boards.toArray()} }
export function parseBackup(value:unknown):Backup { if(!value||typeof value!=='object'||(value as Partial<Backup>).format!=='my-space-backup')throw new Error('This file is not a My Space backup.');const data=value as Partial<Backup>;if(data.version!==1||!Array.isArray(data.documents)||!Array.isArray(data.boards))throw new Error('Unsupported or damaged backup file.');return data as Backup }
export async function importBackup(data:Backup){ await db.transaction('rw',db.documents,db.boards,async()=>{await db.documents.bulkPut(data.documents);await db.boards.bulkPut(data.boards)}) }
export function isQuotaError(error:unknown){ return error instanceof DOMException && (error.name==='QuotaExceededError'||error.name==='NS_ERROR_DOM_QUOTA_REACHED') }
