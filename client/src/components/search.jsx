import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import http from "../services/httpService";

export default function Search(props) {
  const [users, setUsers] = useState([]);
  const params = useParams();

  useEffect(async () => {
    const { data: users } = await http.get(
      "http://localhost:3001/api/users" +
        "?firstName=" +
        props.location.state.firstName
    );

    setUsers(users);
  }, [params]);

  return (
    <div>
      <h1>Search results</h1>
      {users.map((user, index) => (
        <div className="border border-dark rounded p-2 my-2" key={index}>
          <h5 className="ml-2">
            <Link to={"/" + user.username}>
              {user.firstName} {user.lastName}
            </Link>
          </h5>
        </div>
      ))}
    </div>
  );
}
