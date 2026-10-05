const Company = require('../models/Company');


const createCompany = async (req, res) => {
  try {
    const { companyName, hrContactName, hrEmail } = req.body;

    const companyExists = await Company.findOne({ companyName });
    if (companyExists) {
      return res.status(400).json({ message: 'Company already exists in the system' });
    }

    const company = await Company.create({
      companyName,
      hrContactName,
      hrEmail
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ companyName: 1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateCompany = async (req, res) => {
  try {
    const { companyName, hrContactName, hrEmail } = req.body;
    
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.companyName = companyName || company.companyName;
    company.hrContactName = hrContactName || company.hrContactName;
    company.hrEmail = hrEmail || company.hrEmail;

    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const toggleBlacklistStatus = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.isBlacklisted = !company.isBlacklisted;
    const updatedCompany = await company.save();

    res.json({
      message: `Company blacklist status updated to ${company.isBlacklisted}`,
      company: updatedCompany
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  updateCompany,
  toggleBlacklistStatus
};