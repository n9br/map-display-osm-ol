
export class City {
  cname;
  country;
  latitude;
  longitude;
  founding_year;
  rainy_days;
  sun_hours;

  constructor(data) {
    this.cname = data.name.S;
    this.country = data.country.S;
    this.latitude = data.geography.M.latitude.N;
    this.longitude = data.geography.M.longitude.N;
    this.founding_year = data.founding_year.S;
    this.rainy_days = data.geography.M.rainy_days.N;
    this.sun_hours = data.geography.M.monthly_sunshine_hours.N;
  }
}
