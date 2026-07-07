import { AlertTriangle } from 'lucide-react'

export function AIDisclaimer() {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-sm text-amber-700 dark:text-amber-400">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span>此内容由 AI 生成，仅供参考。建议核实关键信息。</span>
    </div>
  )
}
