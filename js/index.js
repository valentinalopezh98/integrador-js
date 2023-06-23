const productsContainer = document.querySelector(".products-container");
const categoriesContainer = document.querySelector(".categories-container");
const categoriesList = document.querySelectorAll(".category");
const showMoreBtn = document.querySelector(".view-more");
const logOptions = document.querySelector(".header-right");
const logOut = document.querySelector(".log-out");
const menuIcon = document.querySelector(".menu-icon");
const cartIcon = document.querySelector(".cart-icon");
const overlay = document.querySelector(".overlay");
const menu = document.querySelector(".navbar-list");
const menuNav = document.querySelector(".nav");
const cart = document.querySelector(".cart");


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
                <p>Agregar</p>
                <i class="fa-solid fa-cart-shopping"></i>
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
    console.log(appState); 
    renderProducts(products[currentProductsIndex]); 
    if (isLastIndexOf()) {
        console.log("entreee")
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
  }

  //Muestra el la opcion de salir si el usuario esta loggeado
  const showLogOut = () => {
    logOut.classList.remove("hidden");
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
    if (cart.classList.contains("open-cart")){
      cart.classList.remove("open-cart");
      return;
    }
    overlay.classList.toggle("show-overlay");
  }

  const toggleCart = () => {
    cart.classList.toggle("open-cart");
    if (menu.classList.contains("open-menu")){
      menu.classList.remove("navbar-list");
      return;
    }
    overlay.classList.toggle("show-overlay");
  }

  //cierra el menu hamburguesa y el overlay cuando hace click en una opcion del menu
  const closeOnClick = (e) =>{
    if (!e.target.classList.contains("nav-link"))return;
    menu.classList.remove("open-menu");
    overlay.classList.remove("show-overlay");
  }

  // cerrar en scroll 
  const closeOnScroll = () => {
    if (!menuIcon.classList.contains("open-menu") && !cartIcon.classList.contains("open-cart")) return;
    overlay.classList.remove("show-overlay");
    menu.classList.remove("open-menu");
    cart.classList.remove("open-cart");
  }

  const closeOnOverlayClick = () =>{
    menu.classList.remove("open-menu");
    cart.classList.remove("open-cart");
    overlay.classList.remove("show-overlay");
  }

  //----------------------------FUNCION INIT----------------------------
  const init = () => {
    renderProducts(appState.products[0]);
    showMoreBtn.addEventListener("click", showMoreProducts);
    categoriesContainer.addEventListener("click", applyFilter);
    document.addEventListener("DOMContentLoaded", showUserOrLog);
    logOut.addEventListener("click", logOutSession);
    cartIcon.addEventListener("click", toggleCart);
    menuIcon.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", closeOnOverlayClick);
  };
  
  init();