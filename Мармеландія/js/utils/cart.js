const CART_KEY = 'cart';

export const getCart = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.product._id === product._id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.product._id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  return updatedCart;
};

export const updateCartItemQuantity = (productId, quantity) => {
  const cart = getCart();
  const item = cart.find(item => item.product._id === productId);

  if (item) {
    item.quantity = quantity;
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  return [];
};

export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

export const getCartItemsCount = () => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}; 