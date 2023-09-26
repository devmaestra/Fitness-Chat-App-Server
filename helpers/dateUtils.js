function formatDate(date) {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    };
    
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    
    return formattedDate;
  }
  
  module.exports = { formatDate };
  