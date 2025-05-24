import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';

const categories = {
  Clothes: ['Men', 'Women', 'Kids', 'Winterwear'],
  Footwear: ['Boots', 'Sneakers', 'Sandals', 'Formal Shoes', 'Sports Shoes', 'Slippers'],
  Electronics: ['TV', 'Washing Machine', 'Refrigerator', 'Laptop', 'Mobile'],
  Furniture: ['Sofa', 'Bed', 'Chair', 'Table'],
  Beauty: ['Skincare', 'Haircare', 'Makeup'],
  Sports: ['Cricket', 'Football', 'Gym Equipment']
};

const sizes = ['S', 'M', 'L', 'XS', 'XL', 'XXL'];

const EditProductPage = ({ setEditDialog, editDialog, selectProduct, setSelectProduct, setRows, rows }) => {
  const url = 'http://localhost:3000';
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubcategory] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [productimgs, setProductImgs] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { allProduct } = useSelector(store => store.products)
  const navigate = useNavigate();

  useEffect(() => {
    const product = allProduct.find((product) => product._id === selectProduct._id)
    if (product) setSelectProduct(product)
  }, [])


  useEffect(() => {
    if (selectProduct) {
      setName(selectProduct.name || '');
      setDescription(selectProduct.description || '');
      setMainCategory(selectProduct.mainCategory || '');
      setSubcategory(selectProduct.subCategory || '');
      setStock(selectProduct.stock || '');
      setPrice(selectProduct.price || '');
      setDiscount(selectProduct.discount || '');
      setSelectedSizes(selectProduct.sizes || []);
      setProductImgs(selectProduct.productimgs || []);
    }
  }, [selectProduct]);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleMainCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setMainCategory(selectedCategory);
    setSubcategory("");
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setProductImgs(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setProductImgs((prev) => prev.filter((_, i) => i !== index));
  };


  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("mainCategory", mainCategory);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("discount", discount);

      // 👇 Send both: updated image files and existing image URLs
      productimgs.forEach((img) => {
        if (typeof img === "string") {
          // Existing URL
          formData.append("existingImgs", img);
        } else {
          // New File
          formData.append("newImgs", img);
        }
      });

      const response = await axios.put(
        `${url}/api/product/editProduct/${selectProduct._id}`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/dashboard/products");
        setLoading(false);
        const updatedList = rows.map((prod) =>
          prod._id === selectProduct._id ? response.data.updatedProduct : prod
        );
        setRows(updatedList);
        setEditDialog(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onClose = () => {
    setEditDialog(false);
  }

  const handleChangeImage = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedImages = [...productimgs];
        updatedImages[index] = reader.result;
        setProductImgs(updatedImages); // Assuming you are using useState
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <Dialog open={editDialog} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Edit Product Details
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Paper elevation={0} sx={{ p: 2, borderRadius: 4 }}>
          <Box display="flex" flexWrap="wrap" gap={4}>
            {/* Left Side */}
            <Box flex={1} minWidth="300px">
              <TextField
                fullWidth
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
                required
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
                required
              />

              <Typography fontWeight="bold" mb={1}>
                Sizes:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSizes.includes(size) ? 'contained' : 'outlined'}
                    color={selectedSizes.includes(size) ? 'primary' : 'inherit'}
                    onClick={() => toggleSize(size)}
                    size="small"
                    sx={{ minWidth: 42, px: 1, fontWeight: 500, borderRadius: 2 }}
                  >
                    {size}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: 'flex' }} gap={2} mb={2}>
                {selectedSizes.map((size) => (
                  <Box key={size}>
                    <Typography mb={1}>{size}</Typography>
                  </Box>
                ))}
              </Box>

              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  size="small"
                  required
                />
                <TextField
                  fullWidth
                  label="Stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  size="small"
                  required
                />
              </Box>

              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  label="Discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  size="small"
                  required
                />
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }} required>
                <InputLabel>Main Category</InputLabel>
                <Select
                  value={mainCategory}
                  onChange={handleMainCategoryChange}
                  label="Main Category"
                >
                  {Object.keys(categories).map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {mainCategory && (
                <FormControl fullWidth sx={{ mb: 2 }} required>
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    value={subCategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    label="Subcategory"
                  >
                    {categories[mainCategory]?.map((subcat, i) => (
                      <MenuItem key={i} value={subcat}>
                        {subcat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {subCategory && (
                <Typography variant="body2" mt={1}>
                  Selected: <strong>{mainCategory} → {subCategory}</strong>
                </Typography>
              )}
            </Box>

            {/* Right Side - Image Upload */}
            <Box flex={1} minWidth="280px">
              <Typography fontWeight="bold" mb={1}>
                Uploaded Product Images
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                {productimgs.map((img, index) => (
                  <Box key={index} position="relative" width={100} height={100}>
                    <Box
                      width={100}
                      height={100}
                      borderRadius="50%"
                      overflow="hidden"
                      border="2px solid #eee"
                    >
                      <img
                        src={img}
                        alt={`Uploaded ${index}`}
                        width="100%"
                        height="100%"
                        style={{ objectFit: "cover" }}
                      />
                    </Box>

                    {/* Close Button */}
                    <IconButton
                      size="small"
                      onClick={() => removeImage(index)}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: "#fff",
                        border: "1px solid #ccc",
                        zIndex: 2,
                        "&:hover": { bgcolor: "#eee" },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>

                    {/* Change Photo Button */}
                    <IconButton
                      size="small"
                      component="label"
                      sx={{
                        position: "absolute",
                        bottom: -8,
                        right: -8,
                        bgcolor: "#fff",
                        border: "1px solid #ccc",
                        zIndex: 2,
                        "&:hover": { bgcolor: "#eee" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleChangeImage(e, index)}
                      />
                    </IconButton>
                  </Box>
                ))}
              </Box>


              <Button variant="outlined" component="label">
                Add More Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  hidden
                />
              </Button>
            </Box>
          </Box>
        </Paper>
      </DialogContent>

      <Box sx={{ justifyContent: "center", p: 3 }} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSave}
          disabled={loading}
          sx={{ px: 5, borderRadius: 3 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
        </Button>
      </Box>
    </Dialog>

  );
};

export default EditProductPage;
