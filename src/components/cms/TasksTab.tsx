import React, { useState } from 'react';
import { Plus, Clock, Award, Compass, CheckCircle2 } from 'lucide-react';
import { TASK_STATUSES } from './seedData';
import type { CmsState } from './useCmsState';
import type { CmsHandlers } from './useCmsHandlers';
import { AddTaskModal } from './AddTaskModal';

interface Props {
  state: CmsState;
  handlers: CmsHandlers;
}

const STAGE_ICONS: Record<string, React.ReactNode> = {
  Backlog: <Clock className="h-4 w-4 text-gold-muted" />,
  'Water Cleanse': <Award className="h-4 w-4 text-blue-500" />,
  'Moon Bath Bathing': <Compass className="h-4 w-4 text-purple-600" />,
  'Sealed / Composed': <CheckCircle2 className="h-4 w-4 text-emerald-800" />
};

export function TasksTab({ state, handlers }: Props) {
  const { tasks } = state;
  const { createTask, moveTask } = handlers;
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="space-y-1">
          <h3 className="font-serif text-lg text-ink">Attunement & Solder Sprint Board</h3>
          <p className="text-xs text-clay font-light">
            Transition pure mineral stones through their required chronological purification stages to lock high
            manifestation frequencies.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="cursor-pointer bg-ink hover:bg-shadow text-white px-5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md border border-stone/20 transition-transform active:scale-98"
        >
          <Plus className="h-4 w-4 text-gold-muted" /> Allocate Purification Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TASK_STATUSES.map((stage) => {
          const stageTasks = tasks.filter((t) => t.status === stage);
          return (
            <div key={stage} className="bg-cream/50 border border-stone rounded-3xl p-4 flex flex-col min-h-[420px] max-h-[550px] overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-stone/40 mb-4 px-1 shrink-0">
                <span className="font-serif text-sm text-ink font-semibold flex items-center gap-2">
                  {STAGE_ICONS[stage]}
                  {stage}
                </span>
                <span className="font-mono text-[10px] text-white bg-ink px-2.5 py-0.5 rounded-full font-bold">
                  {stageTasks.length}
                </span>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-none pb-2">
                {stageTasks.length === 0 ? (
                  <div className="h-full border-2 border-dashed border-stone/30 rounded-xl flex items-center justify-center p-6 text-center text-[10px] font-mono text-clay uppercase tracking-wide">
                    Empty Stage
                  </div>
                ) : (
                  stageTasks.map((task) => (
                    <div key={task.id} className="bg-white border border-stone rounded-2xl p-4 space-y-4 shadow-xs hover:shadow-md transition-shadow select-text">
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[9px] text-gold-muted font-bold">{task.id}</span>
                        <span
                          className={`font-mono text-[8.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded leading-none ${
                            task.priority === 'High'
                              ? 'bg-red-50 text-red-800 border border-red-200/25'
                              : task.priority === 'Medium'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200/25'
                                : 'bg-green-50 text-emerald-800'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <h4 className="font-serif text-xs font-semibold leading-normal text-ink hover:text-gold-muted transition-colors">
                        {task.title}
                      </h4>
                      <div className="flex items-end justify-between pt-3 border-t border-cream text-[10px] font-mono text-clay">
                        <div className="space-y-0.5">
                          <span className="block text-[8px] font-mono uppercase text-clay">Assignee</span>
                          <strong className="text-ink text-[9.5px]">{task.assignee}</strong>
                        </div>
                        <span className="text-[8px] tracking-wide text-amber-900 bg-amber-50 px-1 py-0.5 rounded leading-none">
                          {task.daysLeft}d left
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 font-mono text-[9px]">
                        {stage !== 'Backlog' ? (
                          <button
                            onClick={() => moveTask(task.id, 'backward')}
                            className="cursor-pointer text-clay hover:text-ink p-1 flex items-center gap-0.5"
                            title="Demote to prior phase"
                          >
                            ← Back
                          </button>
                        ) : (
                          <div />
                        )}
                        {stage !== 'Sealed / Composed' ? (
                          <button
                            onClick={() => moveTask(task.id, 'forward')}
                            className="cursor-pointer text-emerald-800 hover:text-emerald-700 font-bold p-1 flex items-center gap-0.5 bg-emerald-50 px-2 rounded-md hover:bg-emerald-100 transition-colors"
                            title="Advance Attunement stage"
                          >
                            Process →
                          </button>
                        ) : (
                          <div className="text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                            ✓ Certified
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <AddTaskModal
          onClose={() => setShowAdd(false)}
          onSubmit={async (form) => {
            await createTask(form);
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}
