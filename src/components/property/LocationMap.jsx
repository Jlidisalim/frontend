const LocationMap = ({ latitude = 36.8065, longitude = 10.1815 }) => {
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12770.230179545475!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2stn!4v1706553708417!5m2!1sen!2stn`;

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Location</h3>

      <div className="rounded-lg overflow-hidden shadow-sm">
        <iframe
          src={mapSrc}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default LocationMap;
