import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Initialisation des utilisateurs depuis le localStorage
    let storedUsers = [];
    try {
      storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    } catch {
      storedUsers = [];
    }
    if (storedUsers.length === 0) {
      storedUsers = [{ id: 1, username: 'admin', password: 'admin' }];
      localStorage.setItem('users', JSON.stringify(storedUsers));
    }
    setUsers(storedUsers);

    // Initialisation des articles depuis le localStorage
    let storedPosts = [];
    try {
      storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    } catch {
      storedPosts = [];
    }
    if (storedPosts.length === 0) {
      storedPosts = [
        {
          id: 1,
          title: 'First Post',
          content: 'Bienvenue sur Blogify ! Ceci est un article exemple.',
          image: '',
          published: true,
          authorId: storedUsers[0].id
        }
      ];
      localStorage.setItem('posts', JSON.stringify(storedPosts));
    }
    setPosts(storedPosts);

    // Initialisation de l'utilisateur courant via le token stocké (simulation JWT)
    const token = localStorage.getItem('token');
    try {
      const savedUser = JSON.parse(localStorage.getItem('currentUser'));
      if (token && savedUser) {
        setCurrentUser(savedUser);
      }
    } catch {
      setCurrentUser(null);
    }

    // Thème : charge le thème depuis le stockage ou met le mode sombre par défaut
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fonctions d'authentification
  const login = (username, password) => {
    const user = users.find(u => u.username === username);
    if (!user || user.password !== password) {
      return false;
    }
    const { password: pwd, ...userWithoutPass } = user;
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPass));
    setCurrentUser(userWithoutPass);
    return true;
  };

  const signup = (username, password) => {
    const existing = users.find(u => u.username === username);
    if (existing) {
      return false;
    }
    const newUser = {
      id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
      username,
      password
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    const { password: pwd, ...userWithoutPass } = newUser;
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPass));
    setCurrentUser(userWithoutPass);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // Fonctions CRUD des articles
  const createPost = (title, content, image, published) => {
    if (!currentUser) return false;
    const newId = posts.reduce((maxId, p) => (p.id > maxId ? p.id : maxId), 0) + 1;
    const newPost = {
      id: newId,
      title,
      content,
      image,
      published,
      authorId: currentUser.id
    };
    const newPosts = [...posts, newPost];
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
    return newId;
  };

  const updatePost = (id, title, content, image, published) => {
    if (!currentUser) return false;
    let updated = false;
    const newPosts = posts.map(p => {
      if (p.id === id) {
        if (p.authorId !== currentUser.id) {
          return p; // ne pas modifier si pas auteur
        }
        updated = true;
        return { ...p, title, content, image, published };
      }
      return p;
    });
    if (!updated) return false;
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
    return true;
  };

  const deletePost = (id) => {
    if (!currentUser) return false;
    const post = posts.find(p => p.id === id);
    if (!post) return false;
    if (post.authorId !== currentUser.id) {
      return false;
    }
    const newPosts = posts.filter(p => p.id !== id);
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
    return true;
  };

  // Utilitaire pour obtenir le nom d'utilisateur par ID (auteur d'un article)
  const getUserName = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.username : '';
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      theme,
      posts,
      login,
      signup,
      logout,
      createPost,
      updatePost,
      deletePost,
      getUserName,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
