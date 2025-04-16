import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createOrderAction} from "@/store/slices/productSlice";
import {Button} from "@mui/material";


function ContactForm(total) {
    const [isDataSent, setIsDataSent] = useState(false);
    const userCart = useSelector(state => state.usercart.userCart)
    console.log(userCart)
    const dispatch = useDispatch();
    const userCartIds = []
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const formData = new FormData();
    userCart.map(item => {
        const temp = []
        temp.push(item.id, item.count)
        userCartIds.push(temp)
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        switch (name) {
            case 'username':
                setUsername(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'address':
                setAddress(value);
                break;
            default:
                break;
        }
    };


    const Submit = (e) => {
        e.preventDefault()
        formData.append('username', username);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('status', "создан");
        formData.append('totalPrice', total.total);
        dispatch(createOrderAction(Object.fromEntries(formData), userCartIds))
        setIsDataSent(true)
    }

    return (
        <div>
            {isDataSent ? (
                <div style={{'background': 'greenyellow'}} className='p-2 border rounded m-5'>
                    <h4>Данные успешно отправлены</h4>
                </div>
            ) : (
                <div>
                    <h5>Оставьте свои контактные данные</h5>

                    <form className="form" onSubmit={e => Submit(e)}>
                        <div className="p-3">
                            <input onChange={handleChange} value={username} className="form-control" name="username"
                                   placeholder="Имя" type="text"/>
                        </div>
                        <div className="p-3">
                            <input onChange={handleChange} value={phone} className="form-control" name="phone"
                                   placeholder="Телефон" type="text"/>
                        </div>
                        <div className="p-3">
                            <input onChange={handleChange} value={address} className="form-control" name="address"
                                   placeholder="Адрес доставки" type="text"/>
                        </div>
                        <div className="p-3">
                            <Button type="submit">
                                Отправить
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ContactForm;
