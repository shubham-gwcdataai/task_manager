import { databases, ID, Query, DB_ID, COL_ID } from "./config";

export const taskService = {
  // CREATE — sends all required fields
  create: (taskName, description, userId) =>
    databases.createDocument(DB_ID, COL_ID, ID.unique(), {
      taskName,                        
      title: taskName,                 
      description: description || "",  
      completed: false,               
      completionStatus: "notStarted",  
      userId,                          
      assignedDate: new Date().toISOString(),  
      dueDate: null,                   
      priority: null,                  
    }),

  // READ — fetch only this user's tasks
  getAll: (userId) =>
    databases.listDocuments(DB_ID, COL_ID, [Query.equal("userId", userId)]),

  // UPDATE — toggle completed + completionStatus together
  update: (id, data) => {
    // If toggling completed, also sync completionStatus enum
    if (typeof data.completed === "boolean") {
      data.completionStatus = data.completed ? "completed" : "notStarted";
    }
    return databases.updateDocument(DB_ID, COL_ID, id, data);
  },

  // UPDATE — edit task name/description
  updateTask: (id, { title, description }) =>
    databases.updateDocument(DB_ID, COL_ID, id, {
      taskName: title,
      title:    title,
      description,
    }),

  // DELETE
  delete: (id) =>
    databases.deleteDocument(DB_ID, COL_ID, id),
};
