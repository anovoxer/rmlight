namespace RMLight.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using RMLight.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<RMLight.Models.RMLightContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(RMLight.Models.RMLightContext context)
        {
            var r = new Random();
            var items = Enumerable.Range(1, 50).Select(o => new Project
            {
                Name = "Name-" + o.ToString(),
                Header = "Header-" + o.ToString(),
                Area = o
            }).ToArray();
            context.Projects.AddOrUpdate(item => new { item.Name }, items);


            var items1 = Enumerable.Range(1, 30).Select(o => new Candidate
            {
                Name = "Name-" + o.ToString(),
                Email = "mailme" + o.ToString() + "@test.com",
                Phone = "555-" + r.Next(10, 99) + "-44",
                Rating = r.Next(5),
                Created = DateTime.Now
            }).ToArray();
            context.Candidates.AddOrUpdate(item => new { item.Name }, items1);

        }
    }
}
