import unittest

class TestRecall(unittest.TestCase):
    def test_day_night(self):
        gt_day, gt_night = 7, 3
        tp_day, tp_night = 7, 1
        self.assertEqual(tp_day + tp_night, 8)
        self.assertAlmostEqual((tp_day + tp_night) / (gt_day + gt_night), 0.8)
        self.assertAlmostEqual(tp_night / gt_night, 1 / 3)
        self.assertEqual(tp_day / gt_day, 1)

if __name__ == "__main__":
    unittest.main()
