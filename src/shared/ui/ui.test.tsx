import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Checkbox } from './checkbox'
import { Modal } from './modal'
import { Tabs } from './tabs'
import { Toggle } from './toggle'

describe('Tabs', () => {
  it('누른 탭을 선택하고 개수를 함께 보여 준다', async () => {
    function Harness() {
      const [value, setValue] = useState<'a' | 'b'>('a')
      return (
        <Tabs
          label="종류"
          value={value}
          onChange={setValue}
          items={[
            { value: 'a', label: '축제', count: 9 },
            { value: 'b', label: '관광지', count: 8 },
          ]}
        />
      )
    }
    render(<Harness />)
    expect(screen.getByRole('tab', { name: '축제 9' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(screen.getByRole('tab', { name: '관광지 8' }))
    expect(screen.getByRole('tab', { name: '관광지 8' })).toHaveAttribute('aria-selected', 'true')
  })
})

describe('Checkbox · Toggle', () => {
  it('누르면 바뀐 값을 알린다', async () => {
    const onCheck = vi.fn()
    const onToggle = vi.fn()
    render(
      <>
        <Checkbox checked={false} onCheckedChange={onCheck} label="비교에 담기" />
        <Toggle checked onCheckedChange={onToggle} label="반려동물" />
      </>,
    )
    await userEvent.click(screen.getByRole('checkbox', { name: '비교에 담기' }))
    await userEvent.click(screen.getByRole('switch', { name: '반려동물' }))
    expect(onCheck).toHaveBeenCalledWith(true)
    expect(onToggle).toHaveBeenCalledWith(false)
  })
})

describe('Modal', () => {
  it('제목·설명을 보여 주고 닫기 버튼으로 닫힌다', async () => {
    const onOpenChange = vi.fn()
    render(
      <Modal
        open
        onOpenChange={onOpenChange}
        title="어디에 저장할까요?"
        description="1박 2일"
        closeButton
      />,
    )
    expect(screen.getByRole('dialog', { name: '어디에 저장할까요?' })).toHaveAccessibleDescription(
      '1박 2일',
    )
    await userEvent.click(screen.getByRole('button', { name: '닫기' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
