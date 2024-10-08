import { MovieData } from './../../interface/movie';
import { Component, OnInit } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent implements OnInit {
  Highcharts = Highcharts;
  moviePieOptions!: {};
  barchart!: {};
  lineobj!: {};
  lineobj2!: {};
  barobj!: {};
  seriesPieOptions!: {};
  isloaded = false;
  categories: Number[] = [];
  movieYear!: number[];
  movieList: MovieData[] = [];
  genre: string[] = [];

  constructor(private route: RouteService) {}

  ngOnInit(): void {
    this.GetPieData();
    this.GetBarData();
    this.GetBarDataByGenre();
    this.GetYearlyRuntimeChangeData();
    this.GetYearlyGenreLangRuntimeChangeData();
  }

  GetPieData() {
    this.route.getMovies().subscribe((result: MovieData[]) => {
      this.movieList = result;
      console.log(this.movieList);

      this.categories = [...new Set(this.movieList.map((x) => x.year))];
      console.log(this.categories);

      const pieData = this.categories.map((year) => {
        return {
          name: year.toString(),
          y: this.movieList.filter((movie) => movie.year === year).length,
        };
      });

      const seriesData = this.categories.map((year) => {
        return {
          name: year.toString(),
          y: this.movieList.filter(
            (movie) => movie.year === year && movie.type === 'series'
          ).length,
          type: 'series',
        };
      });

      this.moviePieOptions = {
        chart: { type: 'pie' },
        title: { text: 'Movies Distribution by Year' },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '{point.name}',
            },
            showInLegend: true,
          },
        },
        series: [
          {
            type: 'pie',
            name: 'Movies Count',
            data: pieData.filter((item) => item.y > 0),
          },
        ],
      };

      this.seriesPieOptions = {
        chart: { type: 'pie' },
        title: { text: 'Series Distribution by Year' },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '{point.name}',
            },
            showInLegend: true,
          },
        },
        series: [
          {
            type: 'pie',
            name: 'Series Count',
            data: seriesData.filter((item) => item.y > 0),
          },
        ],
      };

      this.isloaded = true;
    });
  }

  GetBarData() {
    this.route.getMovies().subscribe((result: MovieData[]) => {
      this.movieList = result;
      console.log(this.movieList);

      this.categories = [...new Set(this.movieList.map((x) => x.year))];
      console.log(this.categories);

      const barData = this.categories.map((year) => {
        const moviesInYear = this.movieList.filter(
          (movie) => movie.year === year
        );
        const avgRating =
          moviesInYear.reduce((sum, movie) => sum + movie.imdbRating, 0) /
          moviesInYear.length;

        return {
          name: year.toString(),
          y: avgRating,
        };
      });

      this.barchart = {
        chart: {
          type: 'column',
        },
        title: {
          text: 'Average IMDb Rating by Year',
        },
        xAxis: {
          categories: this.categories.map((year) => year.toString()),
          title: {
            text: 'Year',
          },
        },
        yAxis: {
          title: {
            text: 'Average IMDb Rating',
          },
          min: 0,
          max: 10,
        },
        tooltip: {
          pointFormat: 'Average Rating: <b>{point.y:.2f}</b>',
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
        },
        series: [
          {
            name: 'IMDb Rating',
            data: barData.map((data) => data.y),
          },
        ],
      };

      this.isloaded = true;
    });
  }

  GetBarDataByGenre() {
    this.route.getMovies().subscribe((result: MovieData[]) => {
      this.movieList = result;
      // console.log(this.movieList);

      let genreSet = new Set<string>();
      this.movieList.forEach((movie) => {
        movie.genre.split(', ').forEach((g) => genreSet.add(g));
      });
      this.genre = Array.from(genreSet);
      console.log(this.genre);

      const barData = this.genre.map((genre) => {
        const moviesInGenre = this.movieList.filter((movie) =>
          movie.genre.includes(genre)
        );
        const avgRuntime =
          moviesInGenre.reduce((sum, movie) => sum + movie.runtime, 0) /
          moviesInGenre.length;

        return {
          name: genre,
          y: avgRuntime,
        };
      });

      console.log('Bar Data by Genre:', barData);

      this.barobj = {
        chart: {
          type: 'bar',
        },
        title: {
          text: 'Average Runtime by Genre',
        },
        xAxis: {
          categories: barData.map((data) => data.name),
          title: {
            text: 'Average Runtime (minutes)',
          },
        },
        yAxis: {
          title: {
            text: 'Genre',
          },
        },
        tooltip: {
          pointFormat: 'Average Runtime: <b>{point.y:.2f} minutes</b>',
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              format: '{point.y:.2f} minutes',
            },
          },
        },
        series: [
          {
            name: 'Runtime',
            data: barData.map((data) => data.y),
          },
        ],
      };

      this.isloaded = true;
    });
  }

  GetYearlyRuntimeChangeData() {
    this.route.getMovies().subscribe((result: MovieData[]) => {
      this.movieList = result;
      console.log(this.movieList);

      this.categories = [...new Set(this.movieList.map((x) => x.year))];
      console.log(this.categories);

      const lineData = this.categories.map((year) => {
        const moviesInYear = this.movieList.filter(
          (movie) => movie.year === year
        );
        const avgRuntime =
          moviesInYear.reduce((sum, movie) => sum + movie.runtime, 0) /
          moviesInYear.length;

        return {
          year: year,
          avgRuntime: avgRuntime,
        };
      });

      console.log('Line Data:', lineData);

      this.lineobj = {
        chart: {
          type: 'line',
        },
        title: {
          text: 'Year-on-Year Average Runtime Change',
        },
        xAxis: {
          categories: lineData.map((data) => data.year.toString()),
          title: {
            text: 'Year',
          },
        },
        yAxis: {
          title: {
            text: 'Average Runtime (minutes)',
          },
          min: 0,
        },
        tooltip: {
          pointFormat:
            'Year: <b>{point.category}</b><br>Avg Runtime: <b>{point.y:.2f} minutes</b>',
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true,
            },
            enableMouseTracking: true,
          },
        },
        series: [
          {
            name: 'Average Runtime',
            data: lineData.map((data) => data.avgRuntime),
          },
        ],
      };

      this.isloaded = true;
    });
  }

  GetYearlyGenreLangRuntimeChangeData() {
    this.route.getMovies().subscribe((result: MovieData[]) => {
      this.movieList = result;
      console.log(this.movieList);

      const years = [...new Set(this.movieList.map((x) => x.year))];

      const genreSet = new Set<string>();
      const languageSet = new Set<string>();
      this.movieList.forEach((movie) => {
        movie.genre.split(', ').forEach((g) => genreSet.add(g));
        movie.language.split(', ').forEach((lang) => languageSet.add(lang));
      });

      const genres = Array.from(genreSet);
      const languages = Array.from(languageSet);

      const genreSeries = genres.map((genre) => {
        return {
          name: genre,
          data: years.map((year) => {
            const moviesInYear = this.movieList.filter(
              (movie) => movie.year === year && movie.genre.includes(genre)
            );
            if (moviesInYear.length === 0) return null;
            const avgRuntime =
              moviesInYear.reduce((sum, movie) => sum + movie.runtime, 0) /
              moviesInYear.length;
            return avgRuntime;
          }),
        };
      });

      const languageSeries = languages.map((language) => {
        return {
          name: language,
          data: years.map((year) => {
            const moviesInYear = this.movieList.filter(
              (movie) =>
                movie.year === year && movie.language.includes(language)
            );
            if (moviesInYear.length === 0) return null;
            const avgRuntime =
              moviesInYear.reduce((sum, movie) => sum + movie.runtime, 0) /
              moviesInYear.length;
            return avgRuntime;
          }),
        };
      });

      console.log('Genre Series:', genreSeries);
      console.log('Language Series:', languageSeries);

      this.lineobj2 = {
        chart: {
          type: 'line',
        },
        title: {
          text: 'Year-on-Year Genre & Language Runtime Change',
        },
        xAxis: {
          categories: years.map((year) => year.toString()),
          title: {
            text: 'Year',
          },
        },
        yAxis: {
          title: {
            text: 'Average Runtime (minutes)',
          },
        },
        tooltip: {
          shared: true,
          pointFormat: 'Average Runtime: <b>{point.y:.2f} minutes</b>',
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true,
            },
            enableMouseTracking: true,
          },
        },
        series: [...genreSeries, ...languageSeries],
      };

      this.isloaded = true;
    });
  }
}
