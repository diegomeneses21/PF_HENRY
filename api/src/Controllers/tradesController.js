const Trade = require('../models/Trades');
const Category = require('../models/Category');
const DeliveryZone = require('../models/DeliveryZone')
const Subcategory = require('../models/Subcategory');
// const { trades } = require("../Auxiliares/comerciantes");
const { trades } = require("../Auxiliares/comercios");
const Products = require('../models/Products');
const bcrypt = require('bcryptjs');


// CATEGORIAS -> [strings de categorias sin repetir]
const getAllCategories = () => {
  return Object.keys(trades[0].categories)  
  
};

// SUBCATEGORIAS -> [strings de subcategorias sin repetir de la categoria buscada]
const getSubCategories = (category) => {
  const tradesByCategory = searchTradesByCategory(category);
  const subcategories = [];
  for (let i = 0; i < tradesByCategory.length; i++) {
    subcategories.push(tradesByCategory[i].subcategory)      
    }    
  return [... new Set(subcategories)];
};

// COMERCIOS -> [Todos los comercios de todas las categorias]
const getAllTrades = () => {
  const allTrades = []
  for (const trade in trades[0].categories) {
    trades[0].categories[trade].map(t => allTrades.push(t))
    }  
  return allTrades;
};

// COMERCIOS -> [comercios con reparto en esa ciudad]
const searchTradesByCity = (deliveryCity) => {
  const tradeByCity = [];
  for (const trade in trades[0].categories) {
    trades[0].categories[trade].map(t => t.deliveryzone.includes(deliveryCity) ? tradeByCity.push(t) : null)
  }
  return tradeByCity;
}
// COMERCIOS -> [comercios con reparto en esa ciudad y categoria seleccionada]
const searchTradesByCityAndCat = (deliveryCity, category) => {
  const tradeByCat = searchTradesByCategory(category);
  const tradesByCity = []
  for (let i = 0; i < tradeByCat.length; i++) {
    tradeByCat[i].deliveryzone.map(c => c === deliveryCity ? tradesByCity.push(tradeByCat[i]) : null)
  }
  if (tradesByCity.length) {
    return tradesByCity
  } else return `No existen comercios de ${category} con entregas en ${deliveryCity}` 
};

// COMERCIOS -> [comercios que coinciden con la búsqueda]
const searchTradesByCityAndCatAndSC = (deliveryCity, category, subcategory) => {
  const tradesByCityAndCat = searchTradesByCityAndCat(deliveryCity, category);
  const tradesBySC = tradesByCityAndCat.filter((t) => t.subcategory === subcategory)
  if (tradesBySC.length) {
    return tradesBySC
  } else return `No existen comercios de ${category+"/"+subcategory} con entregas en ${deliveryCity}`  
};

// COMERCIOS -> [comercios que coinciden con la búsqueda]
const searchProductByCityAndCatAndEpagos = (deliveryCity, category, epagos) => {
  const tradesByCityAndCat = searchTradesByCityAndCat(deliveryCity, category);
  let tradesByEpagos = tradesByCityAndCat.filter(x => x.epagos === epagos)
  
  if (tradesByEpagos.length) {
    return tradesByEpagos
  } else if (tradesByCityAndCat.length) {
    return `No existen comercios de ${category} con entregas en ${deliveryCity} con el método de pago seleccionado`
  } else return `No existen comercios de ${category} con entregas en ${deliveryCity}`
}

// COMERCIOS -> [comercios que coinciden con la búsqueda]
const searchProductosByCityAndCatAndSCCAndEpagos = (deliveryCity, category, subcategory, epagos) => {
  const tradesByCityAndCatAndSCAndEpagos = searchProductByCityAndCatAndEpagos(deliveryCity, category, epagos);
  const tradesBySC = tradesByCityAndCatAndSCAndEpagos.filter((t) => t.subcategory === subcategory)
  if (tradesBySC.length) {
    return tradesBySC
  } else if (tradesByCityAndCatAndSCAndEpagos.length) {
    return `No existen comercios del tipo ${category+"/"+subcategory} en ${deliveryCity} con el método de pago seleccionado`
  } else return `No existen comercios del tipo ${category} en ${deliveryCity} con el método de pago seleccionado` 
};

// COMERCIOS -> [{comercio que coincide con ID}]
const searchTradeById = (id) => {
  var tradeById = [];
  for (const category in trades[0].categories) {
    trades[0].categories[category].map(t => t.id == id ? tradeById.push(t) : null)
    if (tradeById.length) break     
  }
  return tradeById;
};

// [comercios de la categoria buscada]
const searchTradesByCategory = (category) => {
  return trades[0].categories[category]
};

// [comercios de la subcategoria buscada]
const searchTradesBySubCategory = (category, subcategory) => {
  const tradesByCategory = searchTradesByCategory(category);
  return tradesByCategory.filter((t) => t.subcategory === subcategory);  
};




//POST
const postCreateTrades = async (body) => {
    const { password } = body;
    try {
    newTrade = new Trade( body );
    
    const salt = bcrypt.genSaltSync(10);
    newTrade.password = bcrypt.hashSync(password,salt);
    await newTrade.save();

    return true;
    } catch (error) {
      return false;
    }
} 

const postCreateCategory = async ( body ) => {
  try {
    const newCategory = new Category( body);
    await newCategory.save();
    return true
  } catch (error) {
    return false;
  }
}

const postCreateDeliveryZone = async ( body ) => {
  try {
    const newDeliveryZone = new DeliveryZone( body );
    await newDeliveryZone.save();
    return true    
  } catch (error) {
    return false
  }
}

const postCreateSubcategory = async ( body ) => {
  try {
    const newSubcategory = new Subcategory( body );
    await newSubcategory.save();
    return true    
  } catch (error) {
    return false
  }
}

//GET
const getTrades = async () => {
  try {
    const trades = await Trade.find();
    return trades;
  } catch (error) {
    return false;
  }
}

const getCategories = async () => {
  try {
    const categories = await Category.find();
    return categories
  } catch (error) {
    return false
  }
}

const getDeliveryZone = async () => {
  try {
    const deliveryZones = await DeliveryZone.find();
    return deliveryZones;
  } catch (error) {
    return false 
  }
}

const getSubCategoriesController = async () => {
  try {
    const subcategories = await Subcategory.find();
    return subcategories;
  } catch (error) {
    return
  }
}

const updateTradeC = async (id, trade) => {
  try {
    const updateTrade = Trade.findByIdAndUpdate(id,trade,{new: true})
    return updateTrade;
  } catch (error) {
    return false
  }
}
const updateCategoryC = async (id, category) => {
  try {
    const updateCategory = Category.findByIdAndUpdate(id,category,{new: true})
    return updateCategory;
  } catch (error) {
    return false
  }
}
const updateDeliveryC = async (id, delivery) => {
  try {
    const updateDelivery = DeliveryZone.findByIdAndUpdate(id,delivery,{new: true})
    return updateDelivery;
  } catch (error) {
    return false
  }
}

const updateSubcategoryC = async (id, subcategory) => {
  try {
    const subcategory = Subcategory.findByIdAndUpdate(id,subcategory,{new: true})
    return subcategory;
  } catch (error) {
    return false
  }
}



module.exports = {
  searchProductosByCityAndCatAndSCCAndEpagos,
  searchProductByCityAndCatAndEpagos,
  searchTradesByCityAndCatAndSC,
  searchTradesByCityAndCat,
  searchTradesByCity,  
  getAllTrades,
  searchTradeById,
  getAllCategories,
  getSubCategories,
  searchTradesBySubCategory,
  searchTradesByCategory
};
