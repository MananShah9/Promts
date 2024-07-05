function groupWidgetsById(data) {
  const result = {};

  data.forEach(item => {
    const { widget_id, org_position } = item;
    if (!result[widget_id]) {
      result[widget_id] = {
        widget_id,
        org_position,
        children: []
      };
    }
    result[widget_id].children.push(item);
  });

  return Object.values(result);
}

// Sample input data
const inputData = [
  { widget_id: 1, org_position: 'A' },
  { widget_id: 1, org_position: 'B' },
  { widget_id: 2, org_position: 'A' },
  { widget_id: 3, org_position: 'C' },
  { widget_id: 2, org_position: 'B' },
  { widget_id: 1, org_position: 'C' }
];

// Group widgets by id
const groupedData = groupWidgetsById(inputData);

console.log(JSON.stringify(groupedData, null, 2));