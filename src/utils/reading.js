export function readingStatus() {
  return [
    { value: 95, label: "在读" },
    { value: 29, label: "完结" },
    { value: 21, label: "粗读" },
    { value: 15, label: "特殊" },
    { value: 10, label: "弃读" }
  ]
}

export function readingStatusLabel(value) {
  const status = readingStatus().find(item => item.value === value)
  return status ? status.label : "未知"
}
