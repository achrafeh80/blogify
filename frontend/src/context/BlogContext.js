import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
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
      storedUsers = [{ id: 1, username: 'admin', password: 'admin', role: 'Admin' }];
      localStorage.setItem('users', JSON.stringify(storedUsers));
    } else {
      storedUsers = storedUsers.map(u => {
        if (!u.role) {
          return { ...u, role: u.username === 'admin' ? 'Admin' : 'Author' };
        }
        return u;
      });
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

    // Initialisation des commentaires depuis le localStorage
    let storedComments = [];
    try {
      storedComments = JSON.parse(localStorage.getItem('comments')) || [];
    } catch {
      storedComments = [];
    }
    if (storedComments.length === 0) {
      localStorage.setItem('comments', JSON.stringify([]));
    }
    setComments(storedComments);

    // Initialisation de l'utilisateur courant via le token stocké (simulation JWT)
    const token = localStorage.getItem('token');
    try {
      const savedUser = JSON.parse(localStorage.getItem('currentUser'));
      if (token && savedUser) {
        // S'assure que le rôle est défini pour l'utilisateur courant
        if (!savedUser.role) {
          const fullUser = storedUsers.find(u => u.id === savedUser.id);
          if (fullUser) {
            const { password: pwd, ...userWithoutPass } = fullUser;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPass));
            setCurrentUser(userWithoutPass);
          }
        } else {
          setCurrentUser(savedUser);
        }
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

  const signup = (username, password, role = 'Author') => {
    if (role === 'Admin') {
      role = 'Author';
    }
    const existing = users.find(u => u.username === username);
    if (existing) {
      return false;
    }
    const newUser = {
      id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
      username,
      password,
      role
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

  // Gestion des utilisateurs (Admin)
  const createUser = (username, password, role = 'Author') => {
    if (!currentUser || currentUser.role !== 'Admin') return false;
    const existing = users.find(u => u.username === username);
    if (existing) {
      return false;
    }
    const newUser = {
      id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
      username,
      password,
      role
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return true;
  };

  const updateUser = (id, username, password, role) => {
    if (!currentUser) return false;
    if (currentUser.role !== 'Admin' && currentUser.id !== id) {
      return false;
    }
    const existing = users.find(u => u.username === username && u.id !== id);
    if (existing) {
      return false;
    }
    const newUsers = users.map(u => {
      if (u.id === id) {
        const updatedUser = { ...u };
        updatedUser.username = username;
        if (password) {
          updatedUser.password = password;
        }
        if (currentUser.role === 'Admin' && role) {
          updatedUser.role = role;
        }
        return updatedUser;
      }
      return u;
    });
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
    if (currentUser.id === id) {
      const { password: pwd, ...userWithoutPass } = newUsers.find(u => u.id === id);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPass));
      setCurrentUser(userWithoutPass);
    }
    return true;
  };

  const deleteUser = (id) => {
    if (!currentUser) return false;
    if (currentUser.role !== 'Admin' && currentUser.id !== id) {
      return false;
    }
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return false;
    const newUsers = users.filter(u => u.id !== id);
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
    // Supprime également tous les posts et commentaires de cet utilisateur
    const removedPostIds = posts.filter(p => p.authorId === id).map(p => p.id);
    const newPosts = posts.filter(p => p.authorId !== id);
    if (newPosts.length !== posts.length) {
      setPosts(newPosts);
      localStorage.setItem('posts', JSON.stringify(newPosts));
    }
    const newComments = comments.filter(c => c.userId !== id && !removedPostIds.includes(c.postId));
    if (newComments.length !== comments.length) {
      setComments(newComments);
      localStorage.setItem('comments', JSON.stringify(newComments));
    }
    if (currentUser.id === id) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
    }
    return true;
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
        if (p.authorId !== currentUser.id && (currentUser.role !== 'Admin' && !(currentUser.role === 'Editor' && p.published))) {
          return p; // ne pas modifier si pas autorisé
        }
        updated = true;
        return { ...p, title, content, image, published };
      }
      return p;
    });
    if (updated) {
      setPosts(newPosts);
      localStorage.setItem('posts', JSON.stringify(newPosts));
    }
    return updated;
  };

  const deletePost = (id) => {
    if (!currentUser) return false;
    const post = posts.find(p => p.id === id);
    if (!post) return false;
    if (post.authorId !== currentUser.id && (currentUser.role !== 'Admin' && !(currentUser.role === 'Editor' && post.published))) {
      return false;
    }
    const newPosts = posts.filter(p => p.id !== id);
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
    return true;
  };

  // Fonctions CRUD des commentaires
  const createComment = (postId, content) => {
    if (!currentUser) return false;
    const newId = comments.reduce((maxId, c) => (c.id > maxId ? c.id : maxId), 0) + 1;
    const newComment = {
      id: newId,
      postId,
      userId: currentUser.id,
      content
    };
    const newComments = [...comments, newComment];
    setComments(newComments);
    localStorage.setItem('comments', JSON.stringify(newComments));
    return newId;
  };

  const updateComment = (id, content) => {
    if (!currentUser) return false;
    let updated = false;
    const newComments = comments.map(c => {
      if (c.id === id) {
        if (c.userId !== currentUser.id) {
          return c; // ne pas modifier si pas autorisé
        }
        updated = true;
        return { ...c, content };
      }
      return c;
    });
    if (updated) {
      setComments(newComments);
      localStorage.setItem('comments', JSON.stringify(newComments));
    }
    return updated;
  };

  const deleteComment = (id) => {
    if (!currentUser) return false;
    const comment = comments.find(c => c.id === id);
    if (!comment) return false;
    if (comment.userId !== currentUser.id) {
      return false;
    }
    const newComments = comments.filter(c => c.id !== id);
    setComments(newComments);
    localStorage.setItem('comments', JSON.stringify(newComments));
    return true;
  };

  const getUserName = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.username : '';
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      posts,
      comments,
      theme,
      login,
      signup,
      logout,
      createUser,
      updateUser,
      deleteUser,
      createPost,
      updatePost,
      deletePost,
      createComment,
      updateComment,
      deleteComment,
      getUserName,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
