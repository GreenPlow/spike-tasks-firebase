const tasks = [];

export function saveTask(task) {
    tasks.push(task)
}
export function getTasks() {
    return tasks;
}