const Section = ({ title, children }) => {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    );
  };
  
  export default Section;
  