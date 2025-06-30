import React, { useState } from 'react'
import { assets, categories } from '../../assets/assets'
import { useAppContext } from '../../Context/AppContext'
import toast from 'react-hot-toast'

function AddProduct() {

    const [files, setFiles] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [offerPrice, setOfferPrice] = useState('')

    const { axios } = useAppContext()

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()

            const productData = {
                name,
                description: description.split('\n'),
                category,
                price,
                offerPrice
            }

            const formdata = new FormData()
            formdata.append('productData', JSON.stringify(productData))
            for (let i = 0; i < files.length; i++) {
                formdata.append('images', files[i])
            }

            const { data } = await axios.post('/api/product/add', formdata)

            if (data.success) {
                toast.success(data.message)
                setName('')
                setCategory('')
                setDescription('')
                setPrice('')
                setOfferPrice('')
                setFiles([])
            }

        } catch (error) {
            console.error(" error in Add Product(axios)", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message)
            }
            else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    }

    return (

        <div className=" flex flex-col flex-1 h-[95vh] overflow-y-scroll justify-between no-scrollbar">

            <form className=" md:p-10 md:pt-1 p-4  space-y-5 max-w-lg" onSubmit={onSubmitHandler}>

                <div>
                    <p className="text-base font-medium">Product Image</p>

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input
                                    accept="image/*"
                                    type="file"
                                    id={`image${index}`}
                                    hidden
                                    onChange={(e) => {
                                        const uploadFiles = [...files]
                                        uploadFiles[index] = e.target.files[0]
                                        setFiles(uploadFiles)
                                    }} />

                                <img className="max-w-24 cursor-pointer" src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area} alt="uploadArea" width={100} height={100} />

                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input id="product-name" type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required onChange={(e) => setName(e.target.value)} value={name} />
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here" onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                </div>

                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select onChange={(e) => setCategory(e.target.value)} value={category} id="category" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>{item.path}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input id="product-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required onChange={(e) => setPrice(e.target.value)} value={price} />
                    </div>

                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input id="offer-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required onChange={(e) => setOfferPrice(e.target.value)} value={offerPrice} />
                    </div>

                </div>
                <button className="px-8 py-2.5 bg-primary hover:bg-primary-dull transition cursor-pointer text-white font-medium rounded" type='submit'>ADD</button>
            </form>
        </div>

    )
}

export default AddProduct