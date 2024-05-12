import React, { useState } from 'react'
import {
    Button,
    Container,
    Stack,
    TextField,
    Typography,
    Alert,
    Grid,
} from "@mui/material";
import { Box } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import { isLength, isEmail } from "validator";
import CheckIcon from '@mui/icons-material/Check';
import { sendOtp, updatePassword } from '../../api/users';
import ErrorAlert from "../ErrorAlert";



const ForgotPasswordView = () => {
    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        password: "",
        cnfpassword: "",
    });
    const [serverError, setServerError] = useState("");
    const [errors, setErrors] = useState({});
    const [disableEmail, setDisableEmail] = useState(false);
    const [isAlert, setIsAlert] = useState(false);
    const navigate = useNavigate();




    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const errors = {};

        if (!isLength(formData.password, { min: 8 })) {
            errors.password = "Must be at least 8 characters long";
        }
        if (!isLength(formData.cnfpassword, { min: 8 })) {
            errors.cnfpassword = "Must be at least 8 characters long";
        }

        if (formData.password !== formData.cnfpassword) {
            errors.password = "Passwords do not match";
            errors.cnfpassword = "Passwords do not match";
            setServerError("Passwords do not match");
        }

        if (!isEmail(formData.email)) {
            errors.email = "Must be a valid email address";
        }

        setErrors(errors);

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validate();
        console.log(errors);
        if (Object.keys(errors).length !== 0) return;

        console.log(formData);
        setServerError("fale");

        const data = await updatePassword(formData);

        if (data.error) {
            setErrors({ password: data.error });
            console.log("Error:" + data.error);
            return;
        }

        if (data.message) {
            setServerError(data.message);
            console.log("Message:" + data.message);
            return;
        }
        navigate("/login");
    }

    const handleOtpSend = async (e) => {
        e.preventDefault();
        if (!isEmail(formData.email)) {
            setErrors({ email: "Must be a valid email address" });
            return;
        }


        setDisableEmail(true);

        try {
            const res = await sendOtp(formData.email);

            setDisableEmail(true);
            setIsAlert(true);
            console.log("OTP sent");
            console.log(res);


            setTimeout(() => {
                setIsAlert(false);
            }, 6000);
        } catch (err) {
            console.log(err);
        }

        console.log("Send OTP");
    }

    return (
        <>
            <Container maxWidth={"xs"} sx={{ mt: 6 }}>
                <Stack alignItems="center">
                    <Typography variant="h2" color="text.secondary" sx={{ mb: 6 }}>
                        <Link to="/" color="inherit" underline="none">
                            {/* GamersZoo */}
                        </Link>
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Forget Password
                    </Typography>


                    <Box component="form" onSubmit={handleSubmit}>
                        {
                            isAlert ? <Alert
                                severity="success"
                                icon={<CheckIcon fontSize="inherit" />}
                            >
                                Otp Sent
                            </Alert>
                                :
                                ""
                        }
                        <Grid container spacing={1} >
                            <Grid item xs={10}>
                                <TextField
                                    disabled={disableEmail}
                                    label="Email Address"
                                    fullWidth
                                    margin="normal"
                                    autoComplete="email"
                                    required
                                    id="email"
                                    name="email"
                                    onChange={handleChange}
                                    error={errors.email !== undefined}
                                    helperText={errors.email}
                                />
                            </Grid>
                            <Grid item alignItems={"center"} xs={1}>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2, fontSize: "12px" }}
                                    onClick={handleOtpSend}
                                    disabled={disableEmail}
                                >
                                    Send OTP
                                </Button>
                            </Grid>
                        </Grid>
                        <TextField
                            type="number"
                            label="Otp"
                            fullWidth
                            margin="normal"
                            autoComplete="Number"
                            required={false}
                            id="otp"
                            name="otp"
                            onChange={handleChange}
                            error={errors.otp !== undefined}
                            helperText={errors.otp}
                        />
                        <TextField
                            label="Password"
                            fullWidth
                            required
                            margin="normal"
                            autoComplete="password"
                            id="password"
                            name="password"
                            type="password"
                            onChange={handleChange}
                            error={errors.password !== undefined}
                            helperText={errors.password}
                        />
                        <TextField
                            label="Password"
                            fullWidth
                            required
                            margin="normal"
                            autoComplete="password"
                            id="cnfpassword"
                            name="cnfpassword"
                            type="password"
                            onChange={handleChange}
                            error={errors.cnfpassword !== undefined}
                            helperText={errors.cnfpassword}
                        />

                        <ErrorAlert error={serverError} />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ my: 2 }}
                        >
                            Update Password
                        </Button>
                    </Box>

                </Stack>
            </Container>

        </>
    )
}

export default ForgotPasswordView