export default function(jsonUrl='./d/places.json') {
    function addPlaces(planet, options) {
        planet.svg.selectAll('.points,.labels').remove();
        if (planet._places) {
            if (options.places && !options.hidePlaces) {
                addPlacePoints(planet, options);
                addPlaceLabels(planet, options);
                position_labels(planet);
            }
        }
    }

    function addPlacePoints(planet, options) {
        planet.placePoints = planet.svg.append("g").attr("class","points").selectAll("path")
            .data(planet._places.features).enter().append("path")
            .attr("class", "point")
            .attr("d", planet.path);
        return planet.placePoints;
    }

    function addPlaceLabels(planet, options) {
        planet.placeLabels = planet.svg.append("g").attr("class","labels").selectAll("text")
            .data(planet._places.features).enter().append("text")
            .attr("class", "label")
            .text(function(d) { return d.properties.name });
        return planet.placeLabels;
    }

    function position_labels(planet) {
        var centerPos = planet.proj.invert([planet.width / 2, planet.height/2]);

        planet.placeLabels
            .attr("text-anchor",function(d) {
                var x = planet.proj(d.geometry.coordinates)[0];
                return x < planet.width/2-20 ? "end" :
                       x < planet.width/2+20 ? "middle" :
                       "start"
            })
            .attr("transform", function(d) {
                var loc = planet.proj(d.geometry.coordinates),
                    x = loc[0],
                    y = loc[1];
                var offset = x < planet.width/2 ? -5 : 5;
                return "translate(" + (x+offset) + "," + (y-2) + ")"
            })
            .style("display", function(d) {
                return d3.geoDistance(d.geometry.coordinates, centerPos) > 1.57 ? 'none' : 'inline';
            });
    };

    return {
        name: 'placesPlugin',
        data: [jsonUrl],
        ready(planet, options, err, places) {
            planet._places = places;
            planet.recreateSvg(planet);
        },
        onInit(planet, options) {
            options.places = true;
            options.hidePlaces = false;
            planet.addPlaces = addPlaces;
        },
        onRefresh(planet, options) {
            if (planet.placePoints && options.places) {
                planet.placePoints.attr("d", planet.path);
                position_labels(planet);
            }
        }
    };
}
