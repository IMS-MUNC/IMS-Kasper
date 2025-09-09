import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
      <p className="mb-0">2016 - {currentYear} © Kasperinfotech pvt. ltd. All Rights Reserved</p>
      <p>
        Designed &amp; Developed by{' '}
        <a href="javascript:void(0);" className="text-primary">
          Kasperinfotech
        </a>
      </p>
    </div>
  );
};

export default Footer;
