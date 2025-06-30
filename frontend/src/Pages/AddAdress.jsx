import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../Context/AppContext'
import toast from 'react-hot-toast'


// input field
const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        value={address[name]}
        required

        className='w-full px-2 py-2.5 border border-gray-500/50 rounded outline-none text-gray-600 focus:border-primary transition'
    />
)

function AddAdress() {

    const {axios , user ,navigate} = useAppContext()

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();

            const {data} = await axios.post('/api/address/add',{address})

            if(data.success)
            {
                toast.success(data.message)
                navigate('/cart')
            }

        } catch (error) {
             console.error(" error in  add Address (axios)", error);
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message)
                }
                else {
                    toast.error("An unexpected error occurred. Please try again.");
                }
        }
    }

    useEffect(() => {
    if(!user)
    {
        navigate('/cart')
    }
    }, [])
    


    return (
        <div className='mt-16 pb-16'>

            <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span className='font-semibold text-primary'>Address</span></p>

            <div className='flex flex-col-reverse flex-wrap md:flex-row justify-between mt-10 '>
                <div className='flex-1 max-w-md '>

                    <form onSubmit={onSubmitHandler} className='mt-6 text-sm space-y-3'>

                        <div className='grid grid-cols-2 gap-4'>

                            <InputField handleChange={handleChange} address={address} name="firstName" type="text" placeholder="First Name" />

                            <InputField handleChange={handleChange} address={address} name="lastName" type="text" placeholder="Last Name" />

                        </div>

                        <InputField handleChange={handleChange} address={address} name="email" type="email" placeholder="Email Address" />

                        <InputField handleChange={handleChange} address={address} name="street" type="text" placeholder="Street" />

                        <div className='grid grid-cols-2 gap-4'>

                            <InputField handleChange={handleChange} address={address} name="city" type="text" placeholder="City" />

                            <InputField handleChange={handleChange} address={address} name="state" type="text" placeholder="State" />

                        </div>

                        <div className='grid grid-cols-2 gap-4'>

                            <InputField handleChange={handleChange} address={address} name="zipcode" type="number" placeholder="Zipcode" />

                            <InputField handleChange={handleChange} address={address} name="country" type="text" placeholder="Country" />

                        </div>

                        <InputField handleChange={handleChange} address={address} name="phone" type="text" placeholder="Phone" />

                        <button type='submi' className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase'>
                            Save Address
                        </button>


                    </form>

                </div>

                <img src={assets.add_address_iamge} alt="add address" className='md:mr-16 mb-16 md:mt-0' />
            </div>
        </div>
    )
}

export default AddAdress