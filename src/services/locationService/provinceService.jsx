import axios from "axios";

const provinceOpenAPIURL = "https://provinces.open-api.vn"

export const listProvinces = async () => axios.get(`${provinceOpenAPIURL}/api/p`);

export const getProvince = async (code) => axios.get(`${provinceOpenAPIURL}/api/p/${code}`);

export const listDistricts = async () => axios.get(`${provinceOpenAPIURL}/api/d`);

export const getDistrict = async (code) => axios.get(`${provinceOpenAPIURL}/api/d/${code}`);

export const listWards = async () => axios.get(`${provinceOpenAPIURL}/api/w`);

export const getWard = async (code) => axios.get(`${provinceOpenAPIURL}/api/w/${code}`);