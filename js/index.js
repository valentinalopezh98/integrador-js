const productsContainer = document.querySelector(".products-container");
const categoriesContainer = document.querySelector(".categories-container");
const categoriesList = document.querySelectorAll(".category");
const showMoreBtn = document.querySelector(".view-more");
const logOptions = document.querySelector(".header-right");
const mobileLogin = document.querySelector(".login");
const mobileSignin = document.querySelector(".signin");
const logOut = document.querySelector(".log-out");
const mobileLogOut = document.querySelector(".mobile-log-out");
const menuIcon = document.querySelector(".menu-icon");
const cartIcon = document.querySelector(".cart-icon");
const overlay = document.querySelector(".overlay");
const menu = document.querySelector(".navbar-list");
const menuNav = document.querySelector(".nav");
const cart = document.querySelector(".cart");
const cartProducts = document.querySelector(".cart-container");
const deleteBtn = document.querySelector(".btn-delete");
const total = document.querySelector(".total");
const buyBtn = document.querySelector(".buy"); 
const successModal = document.querySelector(".add-modal");


//----------------------------FUNCIONES PARA MOSTRAR PRODUCTOS----------------------------

const arrayToString = (array) =>{
    return array.join(", ");
}

//crea el html de la card del album
const createProductTemplate = (product) => {
    const {id, name, artist, year, genre, rating, price, img} = product;
    return `
    <div class="card">
        <div class="rate">${rating}</div>
        <img src="${img}" alt="${name}">

        <div class="album-data">
            <p class="genre-year">${arrayToString(genre)} / ${year}</p>
            <p class="name-artist">${name} / <span>${artist}</span></p>
        </div>

        <div class="buy">
            <p class="price">$${price}</p>
            <div class="add-to-cart">
              <button class="add"
              data-id='${id}'
              data-name='${name}'
              data-artist='${artist}'
              data-price='${price}'
              data-img='${img}'>Agregar <i class="fa-solid fa-cart-shopping"></i></button>
            </div>
        </div>
    </div>
    `
}

//renderiza una lista de productos
const renderProducts = (productsList) => {
    productsContainer.innerHTML += productsList.map(createProductTemplate).join("");
}

const isLastIndexOf = () => {
    return (appState.currentProductsIndex === appState.productsLimit - 1);
};

//renderiza mas productos al presionar ver mas
const showMoreProducts = () => {
    appState.currentProductsIndex += 1;
    let { products, currentProductsIndex } = appState;
    //console.log(appState); 
    renderProducts(products[currentProductsIndex]); 
    if (isLastIndexOf()) {
        //console.log("entreee")
        showMoreBtn.classList.add("hidden");
    }
};
 
const setShowMoreVisibility = () => {
    if (!appState.activeFilter) {
      showMoreBtn.classList.remove("hidden");
      return;
    }
    showMoreBtn.classList.add("hidden");
};


const changeBtnActiveState = (selectedCategory) => {
    const categories = [...categoriesList];
    categories.forEach((categoryBtn) => {
      if (categoryBtn.dataset.category !== selectedCategory) {
        categoryBtn.classList.remove("selected");
        return;
      }
      categoryBtn.classList.add("selected");
    });
};

//cambia el estado del appstate
const changeFilterState = (btn) => {
    appState.activeFilter = btn.dataset.category;
    changeBtnActiveState(appState.activeFilter);
    setShowMoreVisibility(appState.activeFilter);
};


const isInactiveFilterBtn = (element) => {
    return (
      element.classList.contains("category") &&
      !element.classList.contains("active")
    );
  };
  
  // Función para filtar los productos por categoría y renderizarlos.
  const applyFilter = ({ target }) => {
    if (!isInactiveFilterBtn(target)) return;
  
    changeFilterState(target);
    productsContainer.innerHTML = "";
    if (appState.activeFilter) {
      renderFilteredProducts();
      appState.currentProductsIndex = 0;
      return;
    }
    renderProducts(appState.products[0]);
  };
  
  // Función para aplicar el filtro cuando se apreta un boton de categoria
  const renderFilteredProducts = () => {
    const filteredProducts = productsData.filter(
      (product) => product.category === appState.activeFilter
    );
    renderProducts(filteredProducts);
  };

  //----------------------------FUNCIONES PARA MOSTRAR EL USUARIO O EL LOGIN----------------------------

  //Funcion que indica si la sesion esta iniciada o no
  const isUserLogged = () => {
    return (sessionStorage.getItem("activeUser") != null)
  };
  
  // Funcion que oculta las opciones de ingresar o registrarse si la sesion esta iniciada
  const removeLogOption = () => {
    logOptions.classList.add("hidden");
    mobileLogin.classList.add("hidden");
    mobileSignin.classList.add("hidden");
  }

  //Muestra el la opcion de salir si el usuario esta loggeado
  const showLogOut = () => {
    logOut.classList.remove("hidden");
    mobileLogOut.classList.remove("hidden");
  }

  //Funcion que elimina al usuario del session Storage si cerro sesion
  const removeActiveUser = () =>{
    sessionStorage.removeItem("activeUser");
  }

  const showUserOrLog = () => {
    if (isUserLogged()){
      removeLogOption();
      showLogOut();
    }
  }

  const logOutSession = () => {
    removeActiveUser();
    location.reload();
  }


  //----------------------------TOGGLE MENU Y CART----------------------------
  const toggleMenu = () => {
    menu.classList.toggle("open-menu");
    menu.classList.toggle("navbar-list");
    if (cart.classList.contains("open-cart")){
      cart.classList.remove("open-cart");
      return;
    }
    overlay.classList.toggle("show-overlay");
  }

  const toggleCart = () => {
    cart.classList.toggle("open-cart");
    if (menu.classList.contains("open-menu")){
      menu.classList.toggle("open-menu");
      menu.classList.toggle("navbar-list");
      return;
    }
    overlay.classList.toggle("show-overlay");
  }

  //cierra el menu hamburguesa y el overlay cuando hace click en una opcion del menu
  const closeOnClick = (e) =>{
    if (!e.target.classList.contains("nav-link"))return;
    menu.classList.remove("open-menu");
    menu.classList.add("navbar-list");
    overlay.classList.remove("show-overlay");
  }

  // cerrar en scroll 
  const closeOnScroll = () => {
    if (!menuIcon.classList.contains("open-menu") && !cartIcon.classList.contains("open-cart")) return;
    overlay.classList.remove("show-overlay");
    menu.classList.remove("open-menu");
    cart.classList.remove("open-cart");
    menu.classList.add("navbar-list");
  }

  const closeOnOverlayClick = () =>{
    menu.classList.remove("open-menu");
    cart.classList.remove("open-cart");
    overlay.classList.remove("show-overlay");
    menu.classList.add("navbar-list");
  }

  //----------------------------FUNCIONES PARA EL CART----------------------------
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  
  const saveCart = () =>{
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }

  const createCartProductTemplate = (product) =>{
    const {id, name, artist, price, img, quantity} = product;
    return `
    <div class="cart-product">
      <div class="product">
          <div class="product-img-container">
            <img src="${img}" alt="">
          </div>
          <div class="product-info">
            <p class="product-name">${name}</p>
            <p class="product-artist">${artist}</p>
            <p class="product-price">$${price}</p>
          </div>
      </div>
                    
      <div class="product-handler">
        <span class="quantity-handler down" data-id=${id}>-</span>
        <span class="item-quantity">${quantity}</span>
        <span class="quantity-handler up" data-id=${id}>+</span>
      </div>
      </div>
    `
  }

  const renderCart = () =>{
    if (!cartItems.length){
      cartProducts.innerHTML = `<p class="empty-msg">No hay productos en el carrito.</p>`;
      return;
    }
    cartProducts.innerHTML = cartItems.map(createCartProductTemplate).join("");
  }

  const getTotal = () => {
    return cartItems.reduce((acc, cur) => acc + Number(cur.price) * cur.quantity, 0);
  }

  const showTotal = () =>{
    total.innerHTML = `$${getTotal()}`;
  }

  const disableBtn = (btn) =>{
    if (!cartItems.length){
      btn.classList.add("disabled");
    } else {
      btn.classList.remove("disabled");
    }
  }

  const disableBtn1 = (btn) =>{
    if (!cartItems.length){
      btn.classList.add("disabled-btn");
    } else {
      btn.classList.remove("disabled-btn");
    }
  }

  const updateCartState = () => {
    saveCart();
    renderCart();
    showTotal();
    disableBtn1(buyBtn);
    disableBtn(deleteBtn);
  }

  const addUnitToProduct = (product) => {
    cartItems = cartItems.map((cartProduct) => cartProduct.id === product.id
    ? {...cartProduct, quantity: cartProduct.quantity +1 }
    : cartProduct
    );
  }

  const createCartProduct = (product) => {
    cartItems = [...cartItems, { ...product, quantity: 1 }];
  };

  const isExistingCartProduct = (id) => {
    return cartItems.find((item) => item.id === id);
  };

  const createProductData = (product) => {
    const { id, name, artist, price, img } = product;
    return {id, name, artist, price, img};
  };

  const showSuccess = (msg) => {
    successModal.classList.add("active-modal");
    successModal.textContent = msg;
    setTimeout(() => {
      successModal.classList.remove("active-modal");
    }, 1500);
  };

  const handlePlusBtnEvent = (id) => {
    const existingCartProduct = isExistingCartProduct(id);
    addUnitToProduct(existingCartProduct);
  };

  const handleMinusBtnEvent = (id) => {
    const existingCartProduct = isExistingCartProduct(id);
    if (existingCartProduct.quantity === 1) {
      if (window.confirm("¿Desea eliminar el producto del carrito?")) {
        removeProductFromCart(existingCartProduct);
      }
      return;
    }
    substractProductUnit(existingCartProduct);
  };

  const substractProductUnit = (product) => {
    cartItems = cartItems.map((cartProduct) => {
      return cartProduct.id === product.id
        ? { ...cartProduct, quantity: Number(cartProduct.quantity) - 1 }
        : cartProduct;
    });
  };

  const removeProductFromCart = (existingProduct) => {
    cartItems = cartItems.filter((product) => product.id !== existingProduct.id);
    updateCartState();
  };

  const handleQuantity = (e) => {
    if (e.target.classList.contains("down")) {
      handleMinusBtnEvent(e.target.dataset.id);
    } else if (e.target.classList.contains("up")) {
      handlePlusBtnEvent(e.target.dataset.id);
    }
  
    updateCartState();
  };

  const addProduct = (e) =>{
    if (!e.target.classList.contains("add")) return;

    const product = createProductData(e.target.dataset);
    if (isExistingCartProduct(product.id)){
      addUnitToProduct(product);
      showSuccess("Se agregó una unidad del producto al carrito");
    } else {
      createCartProduct(product);
      showSuccess("El producto se agregó al carrito");
    }

    updateCartState();
  }

  const resetCartItems = () => {
    cartItems = [];
    updateCartState();
  };

  const completeCartAction = (confirmMsg, successMsg) => {
    if (!cartItems.length) return;
    if (window.confirm(confirmMsg)) {
      resetCartItems();
      alert(successMsg);
    }
  };

  const deleteCart = () => {
    completeCartAction(
      "¿Desea vaciar su carrito?",
      "No hay productos en el carrito"
    );
  };

  const completeBuy = () => {
    completeCartAction("¿Desea completar su compra?", "¡Gracias por su compra!");
  };
  
  //----------------------------FUNCIONES PARA VALIDAR FORM DE CONTACTO----------------------------


  //----------------------------FUNCION INIT----------------------------
  const init = () => {
    renderProducts(appState.products[0]);
    showMoreBtn.addEventListener("click", showMoreProducts);
    categoriesContainer.addEventListener("click", applyFilter);

    document.addEventListener("DOMContentLoaded", showUserOrLog);
    logOut.addEventListener("click", logOutSession);
    mobileLogOut.addEventListener("click", logOutSession);

    cartIcon.addEventListener("click", toggleCart);
    menuIcon.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", closeOnOverlayClick);
    window.addEventListener("scroll", closeOnScroll);
    menu.addEventListener("click", closeOnClick);

    document.addEventListener("DOMContentLoaded", renderCart);
    document.addEventListener("DOMContentLoaded", showTotal);
    productsContainer.addEventListener("click", addProduct);
    cartProducts.addEventListener("click", handleQuantity);
    buyBtn.addEventListener("click", completeBuy);
    deleteBtn.addEventListener("click", deleteCart);
    disableBtn1(buyBtn);
    disableBtn(deleteBtn);
  };
  
  init();