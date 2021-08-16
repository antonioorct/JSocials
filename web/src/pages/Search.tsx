import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ContainerComponent from "../components/shared-components/Container";
import UserList from "../components/UserList";
import { IUser } from "../constants/models";
import { searchUsers } from "../services/userServices";

const Container = styled(ContainerComponent)`
  margin-top: 8rem;
`;

const Search: FC = () => {
  const { query } = useParams<{ query: string }>();
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    (async () => {
      const users = await searchUsers(query);

      setUsers(users);
    })();
  }, [query]);

  return (
    <Container>
      <h1>Search Results</h1>

      {users.length === 0 ? (
        <h2>No users found</h2>
      ) : (
        <UserList users={users} />
      )}
    </Container>
  );
};

export default Search;
