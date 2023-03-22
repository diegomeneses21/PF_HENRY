import React, { useEffect, useState } from "react";
import styles from "./SuperAdmin.module.css";
import Header from "../../components/Header/Header";
import { getTradesByName } from "../../redux/actions/getTradesByName";
import {
	getSubCategories,
	getTradesCategories,
	getDeliveryZones,
	commerceRegister,
} from "../../redux/actions/index";
import { useDispatch, useSelector } from "react-redux";
import ButtonPrimary from "../../components/ButtonPrimary/ButtonPrimary";
import swal from "sweetalert";
import {postCategory} from "../../redux/actions/postCategory"
import { postDeliveryZone } from "../../redux/actions/postDeliveryZone";
import { postProductCategory } from "../../redux/actions/postProductCategory";



export default function SuperAdmin() {

	const Validate = (currentInput) => {
		let currentErrors = {};
		let RegExInputCommerceEmail =
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		let RegExInputCommerceText = /^[a-zA-Z\s]*$/;
		let RegExInputCommerceNum = /^[0-9,$]*$/;

		//Validacion nombre del comercio
		if (!currentInput.commerceName) {
			currentErrors.commerceName = "Por favor ingresa un nombre";
		}
		//Validacion categoria
		if (!currentInput.category) {
			currentErrors.category = "Por favor selecciona una categoría";
		}
		//Validacion SubCategoria
		if (!currentInput.subcategory) {
			currentErrors.subcategory = "Por favor selecciona una subcategoría";
		}
		//Validacion descripcion
		if (!currentInput.description) {
			currentErrors.description = "Debes ingresar una descripción";
		}
		//Validacion imagen
		if (!currentInput.image) {
			currentErrors.image = "Selecciona una imagen del comercio de tu galería";
		}
		//Validacion Provincia
		if (!currentInput.province) {
			currentErrors.province = "Ingresa tu Provincia";
		}
		//Validacion Ciudad
		if (!currentInput.city) {
			currentErrors.city = "Ingresa tu ciudad";
		}
		//Validacion Direccion
		if (!currentInput.address) {
			currentErrors.address = "Ingresa tu dirección";
		}
		//Validacion Telefono
		if (!currentInput.phone) {
			currentErrors.phone = "Ingresa tu número de teléfono";
		}
		if (!RegExInputCommerceNum.test(currentInput.telephone)) {
			currentErrors.telephone = "Solo números, por favor";
		}
		//Validacion deliveryZone
		if (!currentInput.deliveryZone) {
			currentErrors.deliveryZone = "Ingresa tu zona de envíos";
		}
		//Validacion UserName
		if (!currentInput.userName) {
			currentErrors.userName = "Ingresa tu nombre de usuario";
		}
		if (currentInput.userName.length < 6) {
			currentErrors.username =
				"Tu nombre de usuario debe tener al menos 6 caracteres";
		}
		//Validacion password
		if (!currentInput.password) {
			currentErrors.password = "Ingresa una contraseña";
		}
		if (currentInput.password.length < 5) {
			currentErrors.password =
				"La contraseña debe contener mas de 5 caracteres";
		}
		//Validacion email
		if (!currentInput.email) {
			currentErrors.email = "Ingresa tu dirección de correo electrónico";
		}
		if (!RegExInputCommerceEmail.test(currentInput.email)) {
			currentErrors.email = "Tu email debe incluir @ y .com";
		}
		//Validacion epagos
		if (!currentInput.epagos) {
			currentErrors.epagos = "Ingresa tu método de pago";
		}

		return currentErrors;
	};
	const dispatch = useDispatch();
	const stateCategories = useSelector((state) => state.tradesCategories);
	const stateSubCategories = useSelector((state) => state.tradesSubCategories);
	const allCommerces = useSelector((state) => state.allCommerces);
	const stateZones = useSelector((state) => state.zones);
	const [currentErrors, setCurrentErrors] = useState({});

	const [currentInput, setCurrentInput] = useState({
		commerceName: "",
		category: "",
		subcategory: "",
		description: "",
		image: "",
		province: "",
		city: "",
		address: "",
		phone: "",
		deliveryZone: [],
		userName: "",
		password: "",
		email: "",
		rating: "",
		epagos: "",
		active: true,
	});

	const [currentCategory, setCurrentCategory] = useState({
		category: ""
	})

	function handlerOnchangeCategory(e){
		setCurrentCategory({
			...currentCategory,
			[e.target.name]: e.target.value
		})
	}

	function handlerSubmitCategory(e){
		e.preventDefault()
		if (!currentCategory.category) {
			swal({
				title: "Erros",
				text: "No has llenado el campo ",
				icon: "warning",
				button: "Ok",
			});	
		}else {
			dispatch(postCategory(currentCategory))
		swal({
			title: "Listo!",
			text: "La categoria fue creada correctamente",
			icon: "success",
			button: "Ok",
		});
		setCurrentCategory({
			category: ""
		})
		}
		
	}

	useEffect(() => {
		dispatch(getTradesCategories());
		dispatch(getDeliveryZones());
	}, [dispatch]);

	useEffect(() => {
		if (currentInput.category !== "default" && currentInput.category) {
			dispatch(getSubCategories(currentInput.category));
		}
	}, [currentInput.category]);

	useEffect(() => {
		if (stateSubCategories) {
			setCurrentInput({ ...currentInput, subcategory: stateSubCategories });
		}
	}, [stateSubCategories]);

	useEffect(() => {
		setCurrentErrors(Validate(currentInput));
	}, [currentInput]);

	const handleChangeInputs = (e) => {
		setCurrentInput({
			...currentInput,
			[e.target.name]: e.target.value,
		});
		setCurrentErrors(
			Validate({
				...currentInput,
				[e.target.name]: e.target.value,
			})
		);
	};

	const handleCommerceImgUpload = async (e) => {
		const files = e.target.files;
		const datas = new FormData();
		datas.append("file", files[0]);
		datas.append("upload_preset", "PEDI-VERY");
		const res = await fetch("https://api.cloudinary.com/v1_1/sebov96/upload", {
			method: "POST",
			body: datas,
		});
		const file = await res.json();
		setCurrentInput({
			...currentInput,
			image: file.secure_url,
		});
	};

	const handleSelectCategories = (e) => {
		e.preventDefault();
		setCurrentInput({
			...currentInput,
			category: e.target.value,
		});
		setCurrentErrors(
			Validate({
				...currentInput,
				category: [...currentInput.category, e.target.value],
			})
		);
	};

	const handleSelectSubCategories = (e) => {
		e.preventDefault();
		setCurrentInput({
			...currentInput,
			subcategory: e.target.value,
		});
		setCurrentErrors(
			Validate({
				...currentInput,
				subcategory: [...currentInput.subcategory, e.target.value],
			})
		);
	};

	const handleSelecDeliveryZone = (e) => {
		e.preventDefault();

		setCurrentInput({
			...currentInput,
			deliveryZone: [currentInput.deliveryZone, e.target.value],
		});
		setCurrentErrors(
			Validate({
				...currentInput,
				deliveryZone: [...currentInput.deliveryZone, e.target.value],
			})
		);
	};

	const handleSelectEpagos = (e) => {
		e.preventDefault();
		setCurrentInput({
			...currentInput,
			epagos: e.target.value,
		});
		setCurrentErrors(
			Validate({
				...currentInput,
				epagos: [...currentInput.epagos, e.target.value],
			})
		);
	};

	//Envio los datos del form al BACK, actualiza, resetea el estado y captura errores
	const handlerSubmit = (e) => {
		e.preventDefault();
		const {
			commerceName,
			category,
			userName,
			epagos,
			password,
			subcategory,
			description,
			email,
			deliveryZone,
			phone,
			image,
			province,
			city,
			address,
		} = currentInput;
		if (
			!commerceName ||
			!category ||
			!subcategory ||
			!description ||
			!image ||
			!province ||
			!city ||
			!address ||
			!phone ||
			!deliveryZone ||
			!userName ||
			!password ||
			!email ||
			!epagos
		) {
			swal({
				title: "Error!",
				text: "Rellena todos los campos correctamente, por favor",
				icon: "error",
				button: "Ok",
			});
		} else {
			dispatch(commerceRegister(currentInput));
			swal({
				title: "Listo!",
				text: "El comercio fue creado correctamente",
				icon: "success",
				button: "Ok",
			});
			setCurrentInput({
				commerceName: "",
				category: "",
				subcategory: "",
				description: "",
				image: "",
				province: "",
				city: "",
				address: "",
				phone: "",
				deliveryZone: [],
				userName: "",
				password: "",
				email: "",
				epagos: "",
				active: true,
			});
		}
	};
	function handlerFilterByName(e) {
		console.log(e.target.value);
		dispatch(getTradesByName(e.target.value));
	}

	const [currentDeliveryZone, setCurrentDeliveryZone] = useState({
		deliveryZone: "",
	})

	function handlerOnchangeDeliveryZone(e) {
		setCurrentDeliveryZone({
			[e.target.name] : e.target.value
		})
	}

	function handlerSubmitDeliveryZone(e) {
		e.preventDefault()
		if (!currentDeliveryZone.deliveryZone) {
			swal({
				title: "Error",
				text: "No has llenado el campo ",
				icon: "warning",
				button: "Ok",
			});	
		}else {
			dispatch(postDeliveryZone(currentDeliveryZone))
		swal({
			title: "Listo!",
			text: "La categoria fue creada correctamente",
			icon: "success",
			button: "Ok",
		});
		setCurrentDeliveryZone({
			deliveryZone: ""
		})
		}
		
	}

	const [currrentProductCategory, setCurrentProductCategory] = useState({
		productCategory: ""
	})

	function handlerOnchangeProductCategory(e) {
		setCurrentProductCategory({
			[e.target.name] : e.target.value 
		})
	}

	function handlerSubmitProductCategory(e) {
		e.preventDefault()
		if (!currrentProductCategory.productCategory) {
			swal({
				title: "Error",
				text: "No has llenado el campo ",
				icon: "warning",
				button: "Ok",
			});	
		}else {
			dispatch(postProductCategory(currrentProductCategory))
		swal({
			title: "Listo!",
			text: "La categoria fue creada correctamente",
			icon: "success",
			button: "Ok",
		});
		setCurrentProductCategory({
			productCategory: ""
		})
		
		
		}
	}

	return (
		<div className={styles.superadmin}>
			<Header />
			<div className={styles.container}>
				<h2>Super admin</h2>

				<div className={styles.content}>
					<h3>Comercios</h3>
					<div className={styles.grid}>
						<div>
							<h4>Crear Comercio</h4>
							<form action="" onSubmit={handlerSubmit}>
							<label htmlFor="">Nombre Del Comercio</label>
							<input
								type="text"
								placeholder=""
								name="commerceName"
								value={currentInput.commerceName}
								onChange={handleChangeInputs}
							/>

							{currentErrors.commerceName && (
								<p>{currentErrors.commerceName}</p>
							)}

							<select onChange={handleSelectCategories}>
								<option value="default" selected disabled>
									Categoria
								</option>
								{stateCategories &&
									stateCategories.map((e) => <option value={e}>{e}</option>)}
							</select>
							{currentErrors.category && <p>{currentErrors.category}</p>}

							<select onChange={handleSelectSubCategories}>
								<option
									value="default"
									selected={currentInput.category === "default"}
								>
									Subcategoria
								</option>

								{currentInput.category && currentInput.category !== "default"
									? stateSubCategories &&
									  stateSubCategories?.map((e) => (
											<option value={e}>{e}</option>
									  ))
									: null}
							</select>
							{currentErrors.subcategory && <p>{currentErrors.subcategory}</p>}

							<label htmlFor="">Descripción</label>
								<input
								type="text"
								placeholder=""
								name="description"
								value={currentInput.description}
								onChange={handleChangeInputs}
							/>
							{currentErrors.description && <p>{currentErrors.description}</p>}

							<label htmlFor="">Imagen</label>
								<input
								type="file"
								placeholder=""
								onChange={handleCommerceImgUpload}
							/>
							{currentErrors.image && <p>{currentErrors.image}</p>}

							<label htmlFor="">Provincia</label>
							<input
								type="text"
								placeholder=""
								name="province"
								value={currentInput.province}
								onChange={handleChangeInputs}
							/>

							<label htmlFor="">Ciudad</label>
							<input
								type="text"
								placeholder=""
								name="city"
								value={currentInput.city}
								onChange={handleChangeInputs}
							/>
							{currentErrors.city && <p>{currentErrors.city}</p>}

							<label htmlFor="">Dirección</label>
							<input
								type="text"
								placeholder=""
								name="address"
								value={currentInput.address}
								onChange={handleChangeInputs}
							/>
							{currentErrors.address && <p>{currentErrors.address}</p>}

							<label htmlFor="">Teléfono</label>
							<input
								type="text"
								placeholder=""
								name="phone"
								value={currentInput.phone}
								onChange={handleChangeInputs}
							/>
							{currentErrors.phone && <p>{currentErrors.phone}</p>}

								<select onChange={handleSelecDeliveryZone}>
								<option value="default" selected disabled>
									Zona de Delivery
								</option>
								{stateZones &&
									stateZones.map((e) => <option value={e}>{e}</option>)}
							</select>
							{currentErrors.deliveryZone && (
								<p>{currentErrors.deliveryZone}</p>
							)}

							<label htmlFor="">Nombre de Usuario</label>
							<input
								type="text"
								placeholder=""
								name="userName"
								value={currentInput.userName}
								onChange={handleChangeInputs}
							/>
							{currentErrors.userName && <p>{currentErrors.userName}</p>}

							<label htmlFor="">Contraseña</label>
							<input
								type="password"
								placeholder=""
								name="password"
								value={currentInput.password}
								onChange={handleChangeInputs}
							/>
							{currentErrors.password && <p>{currentErrors.password}</p>}

							<label htmlFor="">Email</label>
							<input
								type="text"
								placeholder=""
								name="email"
								value={currentInput.email}
								onChange={handleChangeInputs}
							/>
							{currentErrors.email && <p>{currentErrors.email}</p>}

							<select onChange={handleSelectEpagos}>
								<option value="default" selected disabled>
									Medio de Pago
								</option>
								<option>Sólo efectivo</option>
								<option>Sólo tarjetas</option>
								<option>Efectivo/Tarjetas</option>
							</select>
							{currentErrors.epagos && <p>{currentErrors.epagos}</p>}

							<button type="submit">
						<ButtonPrimary texto="CREAR COMERCIO" />
					</button>
							</form>
						</div>
						<div>
							<h4>Editar Comercio</h4>
							<form action="">
								
								<input type="text" />
								<input type="text" />
								<input type="text" />
								<input type="text" />
								<input type="text" />
								<button type="submit">
						<ButtonPrimary texto="EDITAR COMERCIO" />
					</button>
							</form>
						</div>
						<div>
							<h4>Buscar Comercio y eliminar</h4>
							<form action="">
								<input type="text" onChange={handlerFilterByName} />
							</form>
							<div className={styles.trades__container}>
								{commerces.map((x) => (
									<div className={styles.sp_tradeCard}>
										<h4>{x.commerceName}</h4>
										<i class="bx bx-trash"></i>
									</div>
								))}
							</div>
						</div>
						<div>
							<div>
								<form  onSubmit={(e) => handlerSubmitCategory(e)}>
								<h4>Crear Categoria</h4>
								<input 
									type="text"
									name="category"
									value={currentCategory.category}
									onChange={handlerOnchangeCategory}
									/>
								<button type="submit"> Crear </button>
								</form>
							</div>
							<div>
								<h4>Crear Subcategoria</h4>
								<input type="text" />
								<input type="text" />
								<input type="submit" />
							</div>
							<div>
								<form onSubmit={(e) => handlerSubmitDeliveryZone(e)}>
								<h4>Crear DeliveryZone</h4>
								<input 
									type="text"
									name="deliveryZone"
									value={currentDeliveryZone.deliveryZone} 
									onChange={handlerOnchangeDeliveryZone}
								/>
								<button type="submit"> Crear </button>
								</form>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.content}>
					<h3>Productos</h3>
					<div className={styles.grid}>
						<div>
							<h4>Crear Producto</h4>
							<form action="">
								<input type="text" />
								<input type="text" />
								<input type="text" />
								<input type="text" />
								<input type="text" />
								<input type="submit" />
							</form>
						</div>
						<div>
							<h4>Eliminar Producto</h4>
							<form action="">
								<input type="text" />
								<input type="text" />
								<input type="text" />
								<input type="text" />
								<input type="text" />
								<input type="submit" />
							</form>
						</div>
						<div>
							<h4>Buscar Producto y eliminar</h4>
							<form action="">
								<input type="text" />
							</form>
						</div>
						<div>
							<div>
								<form onSubmit={(e) => handlerSubmitProductCategory(e)}>
								<h4>Crear Categoria de Producto</h4>
								<input 
									type="text"
									name="productCategory"
									value={currrentProductCategory.productCategory}
									onChange={handlerOnchangeProductCategory} 
								/>
								<button type="submit" > Crear</button>
								</form>
							</div>

							<div>
								<h4>Crear DeliveryZone</h4>
								<input type="text" />
								<input type="submit" />
							</div>
						</div>
					</div>
				</div>
				<div className={styles.content}>
					<h3>Pedidos</h3>
					<div className={styles.grid}>
						<div className={styles.dosColumnas}>
							<div>
								<h4>Buscar pedido por nro de orden</h4>
								<input type="text" />
								<input type="submit" />
							</div>

							<form action="">
								<p>Filrar por comercio</p>
								<select name="" id="">
									<option value="">Comercio</option>
								</select>
							</form>
						</div>
						<div>
							<h4>Resultados</h4>
						</div>
						<div className={styles.containerReview}>
							<h3>Datos del usuario</h3>
						</div>
					</div>
				</div>
				<div className={styles.content}>
					<h3>Reviews</h3>
					<div className={styles.grid}>
						<div>
							<h4>Ver reviews</h4>
							<table>
								<tr>
									<th>Usuario</th>
									<th>Review</th>
									<th>Accion</th>
								</tr>
								<tr>
									<td>John</td>
									<td>Doe</td>
									<td>
										<button>Eliminar</button>
									</td>
								</tr>
							</table>
						</div>

						<div className={styles.containerReview}>
							<h3>Resultados Reviews</h3>
						</div>
					</div>
				</div>
				<div className={styles.content}>
					<h3>Clientes</h3>
					<div className={styles.grid}>
						<div>
							<h4>Clientes Registrados</h4>
							<table>
								<tr>
									<th>Usuario</th>
									<th>Review</th>
									<th>Accion</th>
								</tr>
								<tr>
									<td>John</td>
									<td>Doe</td>
									<td>
										<button>Eliminar</button>
									</td>
								</tr>
							</table>
						</div>
						<div>
							<h3>Datos del usuario</h3>
							<h5>Editar</h5>
							<form action="">
								<input type="text" />
								<input type="text" />
								<input type="text" />
								<input type="text" />
								<input type="submit" value={'cambiar'} />
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
