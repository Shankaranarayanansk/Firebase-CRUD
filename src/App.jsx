import React, { useEffect, useState } from "react";
import "./App.css";
import { addDoc, collection, doc, query, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./Firebase/index";
import { getDocs } from "firebase/firestore";
import { Toaster, toast } from "sonner";

const EditModal = ({ isOpen, onClose, onSave, initialName, initialPassword }) => {
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState(initialPassword);

  const handleSave = () => {
    onSave(name, password);
    onClose();
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="form-control">
          <label>Enter the name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label>Enter the Password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleSave} className="btn">Save</button>
      </div>
    </div>
  ) : null;
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <p>{message}</p>
        <button onClick={onConfirm} className="btn">
          Confirm
        </button>
        <button onClick={onClose} className="btn">
          Cancel
        </button>
      </div>
    </div>
  ) : null;
};

const App = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [demo, setDemo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = { name, password };
    await addDoc(collection(db, "datas"), data);
    setName("");
    setPassword("");
    toast.success("Data submitted successfully!");
  };

  const getData = async () => {
    const q = query(collection(db, "datas"));
    const querySnapshot = await getDocs(q);
    let demo = [];
    querySnapshot.forEach((doc) => {
      demo.push({ ...doc.data(), id: doc.id });
    });
    setDemo(demo);
  };

  const editdata = async (id, name, password) => {
    try {
      await updateDoc(doc(db, "datas", id), {
        name,
        password,
      });
      getData();
      toast.success("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Error updating data. Please try again.");
    }
  };

  const deletedata = async (id) => {
    try {
      await deleteDoc(doc(db, "datas", id));
      getData();
      toast.success("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Error deleting data");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const openModal = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setShowModal(false);
    setShowConfirmation(false);
    setItemToDelete(null);
  };

  const handleSave = async (newName, newPassword) => {
    if (editingItem) {
      await editdata(editingItem.id, newName, newPassword);
    }
    closeModal();
  };

  const openConfirmationModal = (item) => {
    setItemToDelete(item);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deletedata(itemToDelete.id);
    }
    closeModal();
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">Day to Day Activity</h1>
        <form onSubmit={onSubmit}>
          <div className="form-control">
            <label>Enter the Task to do</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label>Task Domain</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="b2">
            Add Task
          </button>
        </form>
        <table className="table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Task Name</th>
              <th>Task Domain</th>
              <th className="tu">Actions</th>
            </tr>
          </thead>
          <tbody>
            {demo.map((item) => (
              <tr key={item.id}>
                {/* <td>{item.id}</td> */}
                <td>{item.name}</td>
                <td>{item.password}</td>
                <td>
                  <button className="btn1" onClick={() => openModal(item)}>
                    Edit
                  </button>
                  <button
                    className="btn"
                    onClick={() => openConfirmationModal(item)}
                  >
                    Delete
                  </button>
                </td>

                
              </tr>
            ))}
          </tbody>
        </table>
        <Toaster position="top-right" />
        <EditModal
          isOpen={showModal}
          onClose={closeModal}
          onSave={handleSave}
          initialName={editingItem ? editingItem.name : ""}
          initialPassword={editingItem ? editingItem.password : ""}
        />
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={closeModal}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this data?"
        />
      </div>
    </div>
  );
};

export default App;