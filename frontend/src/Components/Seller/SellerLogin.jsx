import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../Context/AppContext'
import toast from 'react-hot-toast'

function SellerLogin() {

    const { isSeller, setIsSeller, navigate, axios } = useAppContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {

        try {
            e.preventDefault();

            const response = await axios.post('/api/seller/login', { email, password })
            const data = response.data

            if (data.success) {
                toast.success(data.message)
                setIsSeller(true)
                navigate('/seller')
            }

        } catch (error) {
            console.error(" error in seller Login(axios)", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message)
            }
             else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }



    }

    useEffect(() => {

        if (isSeller) {
            navigate('/seller')
        }

    }, [isSeller])


    return !isSeller && (
        <form onSubmit={onSubmitHandler} className='min-h-screen flex justify-center items-center text-sm text-gray-600'>

            <div className="flex flex-col gap-4 p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">

                <p className='text-2xl font-medium m-auto'>
                    <span className='text-primary'>Seller</span> Login
                </p>

                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter your Email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>

                <div className="w-full ">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter your Password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                </div>

                <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer" type='submit'>
                    Login
                </button>
            </div>

        </form>
    )
}

export default SellerLogin