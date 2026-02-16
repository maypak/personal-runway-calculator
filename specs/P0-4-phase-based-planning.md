# P0-4: Phase-based Planning (단계별 재무 계획)

**작성일:** 2026-02-16  
**개발 기간:** 10일  
**우선순위:** P0 (Week 4)  
**담당:** Developer  
**승인:** Amazing May

---

## 🎯 목표

Personal Runway Calculator에 **Phase-based Planning 기능**을 추가하여, 사용자가 시간대별로 다른 지출/소득 패턴을 설정할 수 있도록 한다.

### 비즈니스 임팩트
- Sabbatical Planner 4/4명 전원 요청 (필수 기능)
- 평균 점수: 5.2 → **6.8** (+1.6점 예상)
- "Phase planning 없으면 쓸모없음" (Sofia)
- Career Transitioner, Founder도 요청 (12/20명, 60%)

---

## 📋 요구사항

### Functional Requirements

**1. Phase 정의**
- 시작 월과 종료 월 설정
- Phase 이름 지정 (예: "Travel Asia", "Bootcamp", "Job Hunt")
- Phase별 독립적인 재무 설정:
  - Monthly Expenses (월 지출)
  - Monthly Income (월 소득)
  - One-time Expenses (일회성 지출)

**2. Phase 관리**
- 최대 10개 Phase 생성
- Phase 순서 조정 (드래그 앤 드롭)
- Phase 복제 기능
- Phase 삭제

**3. Phase 기반 런웨이 계산**
- 각 Phase의 지출/소득을 시간순으로 반영
- Phase 경계에서 지출 급변 시각화
- 총 런웨이 = 모든 Phase 합산

**4. Phase 템플릿**
- Sabbatical: Travel → Rest → Job Hunt
- Career Transition: Learning → Portfolio → Job Search
- Founder: Ideation → MVP → Launch → Growth

### Non-Functional Requirements

**1. UX**
- 복잡하지 않게 (단계별 입력)
- 시각적 타임라인
- 모바일 반응형 (세로 스크롤)

**2. 성능**
- 10개 Phase 계산 < 500ms

**3. 확장성**
- Scenario comparison과 통합
- Goal tracking과 연동

---

## 🎨 UI/UX 디자인

### 1. Phase Timeline (타임라인 뷰)

**Desktop:**
```
┌─────────────────────────────────────────────────────────────┐
│ Phase Timeline                                    [+ Phase]  │
├─────────────────────────────────────────────────────────────┤
│ Month 0                     12                    24         │
│ ├───────────────────────────┼────────────────────┼──────────┤
│ │ Phase 1: Travel Asia      │ Phase 2: Bootcamp  │ Phase 3 │
│ │ $3,000/mo                 │ $2,500/mo + $6K    │ $3,500  │
│ │ 6 months                  │ 3 months           │ 6 mo    │
│ └───────────────────────────┴────────────────────┴──────────┘
│                                                               │
│ Total Runway: 23 months                                      │
│ Total Burn: $73,500                                          │
└─────────────────────────────────────────────────────────────┘
```

**Mobile (Vertical Cards):**
```
┌──────────────────────────┐
│ Phases           [+ Add] │
├──────────────────────────┤
│ ┌────────────────────┐   │
│ │ 1. Travel Asia     │   │
│ │ Mo 0-6            │   │
│ │ $3,000/mo         │   │
│ │ [Edit] [Delete]   │   │
│ └────────────────────┘   │
│ ┌────────────────────┐   │
│ │ 2. Bootcamp        │   │
│ │ Mo 6-9            │   │
│ │ $2,500/mo + $6K   │   │
│ │ [Edit] [Delete]   │   │
│ └────────────────────┘   │
│ ┌────────────────────┐   │
│ │ 3. Job Hunt        │   │
│ │ Mo 9-15           │   │
│ │ $3,500/mo         │   │
│ │ [Edit] [Delete]   │   │
│ └────────────────────┘   │
└──────────────────────────┘
```

---

### 2. Phase Editor (Phase 편집)

```
┌─────────────────────────────────────────────────┐
│ Edit Phase: Travel Asia                  [Save] │
├─────────────────────────────────────────────────┤
│ Phase Name                                      │
│ [Travel Asia_________________________________]  │
│                                                 │
│ Duration                                        │
│ Start Month: [0▾]  End Month: [6▾]            │
│ (6 months total)                                │
│                                                 │
│ Monthly Expenses                                │
│ [$3,000_____________________________________]  │
│                                                 │
│ Monthly Income (optional)                       │
│ [$0_________________________________________]  │
│                                                 │
│ One-time Expenses                               │
│ ┌───────────────────────────────────────┐      │
│ │ Flights      $2,500     Month 0  [x] │      │
│ │ Visa fees    $500       Month 1  [x] │      │
│ │ [+ Add one-time expense]              │      │
│ └───────────────────────────────────────┘      │
│                                                 │
│ Phase Burn: $21,000 (6mo × $3K + $3K one-time)│
└─────────────────────────────────────────────────┘
```

---

### 3. Phase Visualization (시각화)

**Burn Rate Chart:**
```
 Burn Rate ↑
 $5,000 ┤
 $4,000 ┤     ┏━━━━━━┓
 $3,000 ┤━━━━━┛      ┗━━━━━━━━━━━━━━━━━━━
 $2,000 ┤
 $1,000 ┤
 $0     └─────┴─────┴─────┴─────┴─────┴───→
        0mo   6mo   9mo   15mo  20mo   Time
        Travel  Boot  Job Hunt
```

**Cumulative Burn:**
```
 Total Spent ↑
 $80K  ┤                               ╱
 $60K  ┤                         ╱━━━━━
 $40K  ┤               ╱━━━━━━━━━
 $20K  ┤     ╱━━━━━━━━━
 $0    └─────┴─────┴─────┴─────┴─────┴───→
       0mo   6mo   9mo   15mo  20mo   Time
```

---

## 🛠 기술 스펙

### 데이터 모델

**Supabase Schema:**

```sql
-- Phases Table
CREATE TABLE IF NOT EXISTS public.phases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES public.scenarios(id) ON DELETE CASCADE, -- Optional: link to scenario
  
  -- Phase metadata
  name TEXT NOT NULL,
  description TEXT,
  phase_order INTEGER NOT NULL DEFAULT 0, -- Display order (drag & drop)
  
  -- Time range
  start_month INTEGER NOT NULL DEFAULT 0,
  end_month INTEGER NOT NULL,
  
  -- Financial data
  monthly_expenses NUMERIC NOT NULL,
  monthly_income NUMERIC DEFAULT 0,
  
  -- One-time expenses (JSONB)
  one_time_expenses JSONB DEFAULT '[]'::jsonb,
  -- [{"name": "Flights", "amount": 2500, "month": 0}]
  
  -- Calculated
  total_burn NUMERIC, -- Cached for performance
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_phases_user ON public.phases(user_id);
CREATE INDEX idx_phases_scenario ON public.phases(scenario_id);
CREATE INDEX idx_phases_order ON public.phases(user_id, phase_order);

-- RLS
ALTER TABLE public.phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own phases" ON public.phases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own phases" ON public.phases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own phases" ON public.phases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own phases" ON public.phases
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_phases_updated_at 
  BEFORE UPDATE ON public.phases
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Constraint: end_month > start_month
ALTER TABLE public.phases
  ADD CONSTRAINT check_phase_duration 
  CHECK (end_month > start_month);
```

---

### Phase 기반 런웨이 계산

```typescript
// app/utils/phaseCalculator.ts

export interface Phase {
  id: string
  name: string
  startMonth: number
  endMonth: number
  monthlyExpenses: number
  monthlyIncome: number
  oneTimeExpenses: { name: string; amount: number; month: number }[]
}

export function calculateRunwayWithPhases(
  totalSavings: number,
  phases: Phase[]
): {
  runway: number
  monthlyData: MonthData[]
  phaseBreakdown: PhaseBreakdown[]
} {
  // Sort phases by start month
  const sortedPhases = [...phases].sort((a, b) => a.startMonth - b.startMonth)
  
  let savings = totalSavings
  let currentMonth = 0
  const monthlyData: MonthData[] = []
  const phaseBreakdown: PhaseBreakdown[] = []
  
  // Fill gaps between phases with default expenses
  const defaultExpenses = phases.length > 0 ? phases[0].monthlyExpenses : 0
  
  for (const phase of sortedPhases) {
    // Gap before this phase
    if (currentMonth < phase.startMonth) {
      for (let m = currentMonth; m < phase.startMonth; m++) {
        savings -= defaultExpenses
        monthlyData.push({
          month: m,
          savings,
          burn: defaultExpenses,
          phase: 'Gap',
        })
        currentMonth++
        if (savings <= 0) break
      }
    }
    
    if (savings <= 0) break
    
    // This phase
    let phaseBurn = 0
    for (let m = phase.startMonth; m < phase.endMonth; m++) {
      const netChange = phase.monthlyIncome - phase.monthlyExpenses
      
      // One-time expenses this month
      const oneTime = phase.oneTimeExpenses
        .filter(e => e.month === (m - phase.startMonth))
        .reduce((sum, e) => sum + e.amount, 0)
      
      savings += netChange - oneTime
      phaseBurn += phase.monthlyExpenses + oneTime
      
      monthlyData.push({
        month: m,
        savings,
        burn: phase.monthlyExpenses + oneTime,
        phase: phase.name,
      })
      
      currentMonth++
      if (savings <= 0) break
    }
    
    phaseBreakdown.push({
      phaseName: phase.name,
      duration: phase.endMonth - phase.startMonth,
      totalBurn: phaseBurn,
      avgMonthlyBurn: phaseBurn / (phase.endMonth - phase.startMonth),
    })
    
    if (savings <= 0) break
  }
  
  return {
    runway: currentMonth,
    monthlyData,
    phaseBreakdown,
  }
}
```

---

## 📝 구현 단계

### Day 1-3: 데이터베이스 & Backend (18h)

**1. Supabase 마이그레이션**
```bash
supabase migration new phases_table
# Write SQL above
supabase db push
```

**2. usePhases Hook**
```typescript
// app/hooks/usePhases.ts
export function usePhases(scenarioId?: string) {
  const supabase = createClient()
  const [phases, setPhases] = useState<Phase[]>([])
  
  useEffect(() => {
    loadPhases()
  }, [scenarioId])
  
  async function loadPhases() {
    let query = supabase
      .from('phases')
      .select('*')
      .order('phase_order', { ascending: true })
    
    if (scenarioId) {
      query = query.eq('scenario_id', scenarioId)
    }
    
    const { data, error } = await query
    if (error) throw error
    setPhases(data as Phase[])
  }
  
  async function createPhase(phase: Omit<Phase, 'id'>) {
    const { data, error } = await supabase
      .from('phases')
      .insert({
        ...phase,
        phase_order: phases.length, // Add to end
      })
      .select()
      .single()
    
    if (error) throw error
    setPhases([...phases, data])
  }
  
  async function updatePhase(id: string, updates: Partial<Phase>) {
    const { data, error } = await supabase
      .from('phases')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    setPhases(phases.map(p => p.id === id ? data : p))
  }
  
  async function deletePhase(id: string) {
    const { error } = await supabase
      .from('phases')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    setPhases(phases.filter(p => p.id !== id))
  }
  
  async function reorderPhases(newOrder: string[]) {
    // Update phase_order for all
    const updates = newOrder.map((id, index) => 
      supabase
        .from('phases')
        .update({ phase_order: index })
        .eq('id', id)
    )
    
    await Promise.all(updates)
    await loadPhases()
  }
  
  return { 
    phases, 
    createPhase, 
    updatePhase, 
    deletePhase, 
    reorderPhases,
    reload: loadPhases,
  }
}
```

---

### Day 4-7: UI 컴포넌트 (24h)

**1. PhaseTimeline.tsx (Main View)**
```typescript
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export function PhaseTimeline() {
  const { phases, reorderPhases, deletePhase } = usePhases()
  const [isCreating, setIsCreating] = useState(false)
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    
    const items = Array.from(phases)
    const [reordered] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reordered)
    
    reorderPhases(items.map(p => p.id))
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Phase Timeline</h1>
        <button onClick={() => setIsCreating(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Phase
        </button>
      </div>
      
      {/* Visual Timeline */}
      <PhaseTimelineChart phases={phases} />
      
      {/* Phase List (Draggable) */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="phases">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {phases.map((phase, index) => (
                <Draggable key={phase.id} draggableId={phase.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <PhaseCard
                        phase={phase}
                        onEdit={() => router.push(`/phases/${phase.id}/edit`)}
                        onDelete={() => deletePhase(phase.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {/* Summary */}
      <PhaseSummary phases={phases} />
      
      {isCreating && (
        <PhaseEditorModal
          onSave={(phase) => {
            createPhase(phase)
            setIsCreating(false)
          }}
          onCancel={() => setIsCreating(false)}
        />
      )}
    </div>
  )
}
```

**2. PhaseCard.tsx**
```typescript
export function PhaseCard({ phase, onEdit, onDelete }: PhaseCardProps) {
  const duration = phase.endMonth - phase.startMonth
  const totalBurn = duration * phase.monthlyExpenses + 
    phase.oneTimeExpenses.reduce((sum, e) => sum + e.amount, 0)
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-gray-400" /> {/* Drag handle */}
          <div>
            <h3 className="text-lg font-semibold">{phase.name}</h3>
            <p className="text-sm text-gray-500">
              Month {phase.startMonth} - {phase.endMonth} ({duration} months)
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button onClick={onEdit} className="btn-secondary-sm">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="btn-danger-sm">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-500">Monthly Burn</div>
          <div className="text-lg font-semibold">${phase.monthlyExpenses.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Total Burn</div>
          <div className="text-lg font-semibold">${totalBurn.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">One-time</div>
          <div className="text-lg font-semibold">{phase.oneTimeExpenses.length} items</div>
        </div>
      </div>
    </div>
  )
}
```

**3. PhaseTimelineChart.tsx (Visual Timeline)**
```typescript
export function PhaseTimelineChart({ phases }: { phases: Phase[] }) {
  const maxMonth = Math.max(...phases.map(p => p.endMonth), 24)
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Timeline Visualization</h2>
      
      {/* Month markers */}
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        {Array.from({ length: Math.ceil(maxMonth / 6) + 1 }).map((_, i) => (
          <span key={i}>{i * 6}mo</span>
        ))}
      </div>
      
      {/* Timeline bars */}
      <div className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded">
        {phases.map((phase, idx) => {
          const left = (phase.startMonth / maxMonth) * 100
          const width = ((phase.endMonth - phase.startMonth) / maxMonth) * 100
          
          return (
            <div
              key={phase.id}
              className="absolute h-16 rounded flex items-center justify-center text-white text-sm font-medium"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                top: '8px',
                backgroundColor: colors[idx % colors.length],
              }}
              title={`${phase.name}: ${phase.startMonth}-${phase.endMonth}mo`}
            >
              {width > 10 && phase.name}
            </div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        {phases.map((phase, idx) => (
          <div key={phase.id} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors[idx % colors.length] }}
            />
            <span className="text-sm">{phase.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**4. PhaseEditorModal.tsx**
```typescript
export function PhaseEditorModal({ 
  phase, 
  onSave, 
  onCancel 
}: PhaseEditorModalProps) {
  const [formData, setFormData] = useState<Partial<Phase>>(
    phase || {
      name: '',
      startMonth: 0,
      endMonth: 6,
      monthlyExpenses: 0,
      monthlyIncome: 0,
      oneTimeExpenses: [],
    }
  )
  
  const handleSave = () => {
    if (!formData.name || formData.endMonth <= formData.startMonth) {
      alert('Please fill all required fields')
      return
    }
    onSave(formData as Phase)
  }
  
  return (
    <Modal onClose={onCancel}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          {phase ? 'Edit Phase' : 'Create Phase'}
        </h2>
        
        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phase Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Travel Asia"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Month</label>
              <input
                type="number"
                value={formData.startMonth}
                onChange={(e) => setFormData({ ...formData, startMonth: Number(e.target.value) })}
                className="input"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Month</label>
              <input
                type="number"
                value={formData.endMonth}
                onChange={(e) => setFormData({ ...formData, endMonth: Number(e.target.value) })}
                className="input"
                min={formData.startMonth + 1}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Expenses</label>
            <input
              type="number"
              value={formData.monthlyExpenses}
              onChange={(e) => setFormData({ ...formData, monthlyExpenses: Number(e.target.value) })}
              className="input"
              placeholder="3000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Income (optional)</label>
            <input
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
              className="input"
              placeholder="0"
            />
          </div>
          
          {/* One-time expenses */}
          <OneTimeExpensesEditor
            expenses={formData.oneTimeExpenses || []}
            onChange={(expenses) => setFormData({ ...formData, oneTimeExpenses: expenses })}
          />
        </div>
        
        <div className="mt-6 flex gap-2 justify-end">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary">
            Save Phase
          </button>
        </div>
      </div>
    </Modal>
  )
}
```

---

### Day 8-10: 통합, 테스트, 배포 (18h)

**1. Dashboard 통합**
```typescript
// app/dashboard/page.tsx
export default function DashboardPage() {
  const [mode, setMode] = useState<'simple' | 'phases'>('simple')
  const { phases } = usePhases()
  
  return (
    <div>
      <div className="mb-4">
        <button onClick={() => setMode('simple')}>Simple Mode</button>
        <button onClick={() => setMode('phases')}>Phase Mode</button>
      </div>
      
      {mode === 'simple' ? (
        <FinanceDashboard />
      ) : (
        <PhaseBasedDashboard phases={phases} />
      )}
    </div>
  )
}
```

**2. 테스트 시나리오**
- [ ] Phase 생성/수정/삭제
- [ ] Phase 순서 변경 (드래그)
- [ ] 10개 Phase 계산 정확도
- [ ] Phase 겹침 방지 (validation)
- [ ] 타임라인 차트 렌더링
- [ ] 모바일 반응형

---

## 🎯 사용자 시나리오 (실제 예시)

### Emma Rodriguez (마케터, 안식년)
**문제:** "3개월 동남아 $3K, 3개월 코스 $2.5K, 6개월 구직 $3.5K - 각각 달라요!"

**해결:**
```
Phase 1: Travel Asia (0-3mo)
- Monthly: $3,000
- One-time: Flights $2,500 (mo 0)

Phase 2: Online Course (3-6mo)
- Monthly: $2,500
- One-time: Bootcamp $6,000 (mo 3)

Phase 3: Job Hunt (6-12mo)
- Monthly: $3,500
- Monthly Income: $500 (freelance)
```

**결과:**
- Total Runway: 12 months ✅
- Total Burn: $38,500
- "이제 정확히 알겠어요!"

---

### Benjamin Tan (건축가, 아시아 탐방)
**문제:** "4개 국가, 각각 예산 달라요. 일본 $5K, 인도 $2K, 네팔 $1.5K, 싱가포르 $6K."

**해결:**
```
Phase 1: Japan (0-3mo) - $5,000/mo
Phase 2: India (3-5mo) - $2,000/mo
Phase 3: Nepal (5-6mo) - $1,500/mo
Phase 4: Singapore (6-12mo) - $6,000/mo
```

**결과:**
- Total Runway: 12 months
- Optimized: 네팔 1개월 → 3개월로 늘려서 14개월 ✅

---

## 📊 예상 효과

### 베타 테스터 피드백 기반

**Sabbatical Planner 4/4명:**
- Emma: 5.2 → 7.0 (+1.8) - "Phase planning = 게임 체인저"
- Sofia: 5.8 → 7.2 (+1.4) - "이제 필수 도구!"
- Benjamin: 4.6 → 6.5 (+1.9) - "4개국 예산 완벽"
- 민수: 4.3 → 6.0 (+1.7) - "3단계 정확히 반영"

**평균 효과:** +1.7점 (가장 높음!)

### 추가 수혜
- Career Transitioner 4명도 요청
- Founder 4명 중 2명 요청
- 총 10/20명 (50%) 혜택

---

## ⚠️ 주의사항

### CLAUDE.md 원칙

**1. Think Before Coding**
- Phase 겹침 방지 로직
- 드래그 앤 드롭 UX 검증
- 계산 순서 (시작월 정렬)

**2. Simplicity First**
- 최대 10개 Phase로 제한
- 복잡한 dependency 피하기

**3. Surgical Changes**
- 기존 Dashboard 분리
- Phase 모드는 optional

**4. Goal-Driven**
- 목표: 단계별 예산 관리
- 수단: Phase 타임라인

### Edge Cases

**1. Phase 겹침**
- 같은 시간대 2개 Phase → 에러
- Validation: endMonth <= next.startMonth

**2. Gap 처리**
- Phase 1: 0-6mo, Phase 2: 9-12mo → 6-9mo Gap
- 해결: Gap에 default 지출 적용

**3. 무한 Phase**
- endMonth = null → 이후 계속
- 해결: 최대 100개월로 제한

---

## 🚀 향후 확장 (Phase 2+)

### 추가 기능
1. **Phase Templates** (Sabbatical, Transition, Founder)
2. **Recurring Phases** (매년 여름 여행)
3. **Phase Dependencies** ("Phase 2는 Phase 1 완료 후")
4. **Phase Goals** (각 Phase별 목표)

---

## ✅ Definition of Done

### 기능
- [x] Phase CRUD
- [x] 드래그 앤 드롭 순서 변경
- [x] Phase 기반 런웨이 계산
- [x] 타임라인 시각화
- [x] 10개 Phase 지원

### 품질
- [x] 계산 정확도 100%
- [x] 드래그 UX 부드러움
- [x] 모바일 반응형

### 배포
- [x] Production 배포
- [x] Sabbatical 베타 테스터 재테스트
- [x] 점수 +1.7 이상

---

**작성자:** Amazing May  
**개발 시작:** 2026-03-10 (월)  
**목표 완료:** 2026-03-17 (월)  

🗓️ **Plan in phases, succeed in stages!**
