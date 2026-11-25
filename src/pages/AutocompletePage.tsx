import { useState } from 'react';

import {
  Autocomplete,
  type User,
} from '../components/autocomplete';

function App() {
  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);

    console.log('Selected user:', user);
  };

  return (
    <main style={{ padding: '40px' }}>
      <h1>User Autocomplete</h1>

      <Autocomplete
        placeholder="Search users..."
        minCharacters={2}
        debounceMs={300}
        onSelect={handleUserSelect}
      />

      {selectedUser && (
        <div style={{ marginTop: '24px' }}>
          <h3>Selected User Details</h3>

          <p>
            Name: {selectedUser.firstName}{' '}
            {selectedUser.lastName}
          </p>

          <p>Email: {selectedUser.email}</p>
        </div>
      )}
    </main>
  );
}

export default App;