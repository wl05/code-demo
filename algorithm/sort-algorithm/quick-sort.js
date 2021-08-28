// 双边循环
function quickSort1(nums, leftIndex, rightIndex) {
  if (leftIndex >= rightIndex) {
    return;
  }
  const pivotIndex = partition(nums, leftIndex, rightIndex);
  quickSort(nums, leftIndex, pivotIndex - 1);
  quickSort(nums, pivotIndex + 1, rightIndex);
}

function partition(nums, leftIndex, rightIndex) {
  const pivot = nums[leftIndex];
  let left = leftIndex;
  let right = rightIndex;
  while (left !== right) {
    while (left < right && pivot < nums[right]) {
      right--;
    }
    while (left < right && pivot >= nums[left]) {
      left++;
    }
    if (left < right) {
      const temp = nums[left];
      nums[left] = nums[right];
      nums[right] = temp;
    }
  }

  nums[leftIndex] = nums[left];
  nums[left] = pivot;

  return left;
}

const nums = [9, 2, 1, 3, 4, 8, 9, 10, 6, 5, 7];
quickSort1(nums, 0, nums.length - 1);
console.log("====quickSort====", nums);