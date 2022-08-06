// @ts-nocheck
import React, { FormEvent, useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

interface Employee {
  id: number;
  employeeName: string;
  position: string;
  age: string;
}

function App() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [age, setAge] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [employeeList, setEmployeeList] = useState<Employee>([]);
  const [editId, setEditId] = useState(-1);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/get")
      .then((response) => {
        console.log(response);
        setEmployeeList(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const addEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("button clicked");
    console.log(name, position, age);

    axios
      .post("http://localhost:3001/api/add", {
        employeeName: name,
        position,
        age,
      })
      .then((response) => {
        console.log(response);
        setEmployeeList([
          ...employeeList,
          {
            id: response.data.insertId,
            employeeName: name,
            position,
            age,
          },
        ]);
        // alert("Employee Added successfully");
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
    setName("");
    setAge("");
    setPosition("");
  };

  const deleteEmployee = (id: number, index: number) => {
    axios
      .delete(`http://localhost:3001/api/delete/${id}`)
      .then((response) => {
        console.log(response);
        const list = [...employeeList];
        list.splice(index, 1);
        setEmployeeList(list);
        setEditMode(false);
        setName("");
        setAge("");
        setPosition("");
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  const updateEmployee = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    console.log("edit button click");
    console.log(id, name, position, age);
    axios
      .put(`http://localhost:3001/api/update/${id}`, {
        employeeName: name,
        position,
        age,
      })
      .then((response) => {
        console.log(response);
        for (const emp of employeeList) {
          if (emp.id === editId) {
            emp.employeeName = name;
            emp.position = position;
            emp.age = age;
          }
        }
        setEditMode(false);
        setName("");
        setAge("");
        setPosition("");
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  return (
    <div className="container">
      <h4 className="mt-4 text-center">Employee Form</h4>
      <form className="formstyle">
        <input
          className="form-control"
          type="text"
          placeholder="Enter employee name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <input
          className="form-control"
          type="text"
          placeholder="Enter employee position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <br />
        <input
          className="form-control"
          type="number"
          placeholder="Enter employee age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <br />
        {editMode ? (
          <button
            onClick={(e) => updateEmployee(e, editId)}
            className="form-control btn btn-secondary"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={addEmployee}
            className="form-control btn btn-primary"
          >
            Save
          </button>
        )}
      </form>

      <h4 className="mt-4 mb-4 text-center">Employee Data</h4>
      <table className="table">
        <thead className="table-dark">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Employee Name</th>
            <th scope="col">Position</th>
            <th scope="col">Age</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.map((emp, index) => (
            <tr key={emp.id}>
              <th scope="row">{emp.id}</th>
              <td>{emp.employeeName}</td>
              <td>{emp.position}</td>
              <td>{emp.age}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => deleteEmployee(emp.id, index)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-secondary btn-sm me-2"
                  onClick={() => {
                    setEditMode(true);
                    setName(emp.employeeName);
                    setPosition(emp.position);
                    setAge(emp.age);
                    setEditId(emp.id);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
